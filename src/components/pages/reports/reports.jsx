import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  useDisclosure,
  Collapse,
  ButtonGroup,
  Heading,
} from "@chakra-ui/react";
import StyledSelect from "../../ui/styled-select/styled-select";
import { ThemeContext } from "../../../context/theme";
import ComplexTable from "../../ui/table/complex-table";
import { Icon } from "@chakra-ui/icons";
import { TbReport } from "react-icons/tb";
import {
  createScheduledReports,
  getData,
  getOptions,
  getScheduledReportsOptions,
} from "../../../api/reports";
import HistoryPicker from "../../ui/history-picker/history-picker";
import { showsuccess } from "../../../helpers/toast-emitter";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { getReportsUiSchema } from "../../../data/reports";
import { getFormsWidgets } from "../../../data/alarms";
import { useNavigate } from "react-router";
import {
  extractContainerHeaders,
  extractUniqueKeys,
  flattenObject,
} from "../../../helpers/array-map";
import PdfExport from "../../ui/pdf-export/pdf-export";
import ExcelExport from "../../ui/excel-export/excel-export";
import { DevicesContext } from "../../../context/devices";
import ObjectFieldTemplate from "../../form-widgets/custom-object";
import { useMediaQuery } from "@chakra-ui/react";

function Reports() {
  const { darkMode } = useContext(ThemeContext);
  const [isNonMobile] = useMediaQuery("(min-width: 600px)");
  const deviceCtx = useContext(DevicesContext);
  const [devices, setDevices] = useState([]);
  const [containers, setContainers] = useState([]);
  const [project, setProject] = useState("cylocks");
  const [containerChoices, setContainerChoices] = useState([]);
  const [containersChoice, setContainersChoice] = useState([]);
  const [lockReportPage, setLockReportPage] = useState(0);
  const [fieldsValues, setFieldsValues] = useState({});
  const { isOpen, onToggle } = useDisclosure();
  const formRef = React.useRef(null);
  const [actions, setActions] = useState([]);
  const [allActions, setAllActions] = useState([]);
  const [reportsOptions, setReportsOptions] = useState([]);
  const [entity, setEntity] = useState(-1);
  const [actionId, setActionId] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldsChoices, setFieldsChoices] = useState([]);
  const [fieldsquery, setFieldsquery] = useState({});
  const [formSchema, setFormSchema] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let entityId;

  useEffect(() => {
    const choices = [];
    actionId.forEach((action) => {
      if (action.allowedFields) {
        choices.push(...action.allowedFields);
      }
    });
    setFieldsChoices(Array.from(new Set(choices)));
  }, [actionId, actions]);

  useEffect(() => {
    if (deviceCtx) {
      if (deviceCtx.devicesObj.devices) {
        const devices = [];
        if (deviceCtx.devicesObj.devices.cycollector) {
          devices.push(...deviceCtx.devicesObj.devices.cycollector);
        }
        if (deviceCtx.devicesObj.devices.cytag) {
          devices.push(...deviceCtx.devicesObj.devices.cytag);
        }
        setDevices(devices);
      }
      if (deviceCtx.containers) {
        setContainers(deviceCtx.containers);
        setContainerChoices([
          ...Array.from(
            new Set(
              deviceCtx.containers.map((container) => {
                return JSON.stringify({
                  label: container.name,
                  value: container.name,
                });
              })
            )
          ).map((ob) => JSON.parse(ob)),
        ]);
      }
    }
  }, [deviceCtx]);

  useEffect(() => {
    if (
      deviceCtx.devicesObj.devices.cycollector &&
      deviceCtx.devicesObj.devices.cycollector.length == 0
    ) {
      deviceCtx.getDevicesCall();
    }

    if (deviceCtx.containers && deviceCtx.containers.length == 0) {
      deviceCtx.getContainersCall();
    }
  }, []);

  useEffect(() => {
    getOptions().then((res) => {
      setReportsOptions(res.data.entity.map((ent) => ent.name));
      setAllActions(res.data.entity_actions_type);
    });
    getScheduledReportsOptions().then((res) =>
      setFormSchema(res.data.scheduled_report_options)
    );
  }, []);

  useEffect(() => {
    const updatedFields = [];
    fields.forEach((field) => {
      if (fieldsChoices.includes(field.value)) {
        updatedFields.push(field);
      } else {
        delete fieldsquery[field.value];
        setFieldsValues({ ...fieldsValues, [field.value]: [] });
      }
    });
    setFields(updatedFields);
  }, [fieldsChoices]);

  const handleSelectData = () => {
    setLoading(true);

    if(project=="cylocks"){

    getData(
      entity,
      actionId.map((e) => e.value).toString(),
      startDate ? startDate + "" : startDate,
      endDate + "",
      entityId,
      fieldsquery
    )
      .then((res) => {
        setLockReportPage(0)
        setTableData(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false)); }
      else{
        setLockReportPage(0)
        setLoading(false)
        setTableData(
          containers
            .filter((cont) => containersChoice.find((v) => v.value === cont.name))
            .map((con) => {
              return {
                ...con.details,
                container_name: con.name,
                device: `${con.device.name} : ${con.device.id}`,
              };
            })
        );
      }
  };

  const setReportsScheduling = () => {
    let actions = "";
    if (actionId) {
      let isAllSelected = actionId.find((field) => field.value === "all");
      if (!isAllSelected) {
        actionId.forEach((action, index) => {
          actions = actions + action.value;
          if (index < actionId.length - 1) {
            actions = actions + ",";
          }
        });
      } else {
        actions = null;
      }
    }
    createScheduledReports(
      Object.assign(formRef.current.state.formData, {
        scheduled_at: formRef.current.state.formData.scheduled_at.replace(
          "Z",
          ""
        ),
      }),
      entity,
      actions,
      fieldsquery
    ).then((res) => showsuccess("Successfully added scheduled reports"));
  };

  const setFiledQueryCall = (field, value, allValues) => {
    allValues.shift();
    const fields = { ...fieldsquery };
    fields[field] = value.map((vl) => vl.value);
    setFieldsquery(fields);
  };

  const setDataContainer = (val) => {
    setContainersChoice(val);
    // setLockReportPage(0)
    // setTableData(
    //   containers
    //     .filter((cont) => val.find((v) => v.value === cont.name))
    //     .map((con) => {
    //       return {
    //         ...con.details,
    //         container_name: con.name,
    //         device: `${con.device.name} : ${con.device.id}`,
    //       };
    //     })
    // );
  };

  const prepareReportsForExport = (data) => {
    const keys = extractUniqueKeys(data);
    data.map((dev) => {
      keys.forEach((key) => {
        if (dev[key]) {
          dev[key] = String(dev[key]) + "";
        } else {
          dev[key] = "-";
        }
      });
      return dev;
    });
    return data;
  };

  const ContainersForm = () => {
    return (
      <>
        <Box w={"340px"} p={1}>
          <Text p={1} color={"text.primary"} fontWeight={"bold"}>
            Choose Entity:
          </Text>
          <StyledSelect
            multi
            value={containersChoice}
            general={true}
            options={containerChoices}
            onchange={setDataContainer}
            disabled={true}
          />
        </Box>
      </>
    );
  };

  const titleDisplayed = (title) => {
    const titleSplitted = title.split("_");
    let titleToDisplay = "";
    titleSplitted.forEach((word) => {
      titleToDisplay += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    });
    return titleToDisplay;
  };

  const CylockForm = () => {
    return (
      <>
        <>
          <Box w={"340px"} p={1}>
            <Text p={1} color={"text.primary"} fontWeight={"bold"}>
              Choose Entity:
            </Text>
            <StyledSelect
              value={entity}
              general={true}
              required={true}
              onchange={(val) => {
                setEntity(val);
                const vals = [];
                vals.push(...allActions[val]);
                setActions(vals);
                setActionId([]);
                setFields([]);
                setFieldsquery({});
                setFieldsValues({});
              }}
              options={reportsOptions.map((op) => {
                if (op === "cycollector") {
                  return { label: "cylock", value: "cycollector" };
                } else {
                  return { label: op, value: op };
                }
              })}
            />
          </Box>
          {entity !== -1 ? (
            <Box w={"340px"} p={1}>
              <Text p={1} color={"text.primary"} fontWeight={"bold"}>
                Pick Action:
              </Text>

              <Box minH={"45px"}>
                <StyledSelect
                  multi
                  value={actionId}
                  onchange={(val) => {
                    setActionId(val);
                    Object.keys(fieldsquery).forEach(function (key) {
                      const result = val.find((field) => field.value === key);
                      if (result === undefined) {
                        delete fieldsquery[key];
                        let newFiledsValues = fieldsValues;
                        newFiledsValues[key] = [];
                        setFieldsValues(newFiledsValues);
                      }
                    });
                  }}
                  options={[
                    ...actions.map((action) => {
                      return {
                        ...action,
                        label:  action.name[0].toUpperCase() + action.name.replaceAll("_", " ").slice(1,action.name.length),
                        value: action.name,
                      };
                    }),
                  ]}
                />
              </Box>
            </Box>
          ) : (
            ""
          )}
          {actionId.length !== 0 ? (
            <Box w={"340px"} p={1}>
              <Text p={1} color={"text.primary"} fontWeight={"bold"}>
                Pick Field:
              </Text>
              <StyledSelect
                multi
                value={fields}
                onchange={(val) => {
                  setFields(val);
                  Object.keys(fieldsquery).forEach(function (key) {
                    const result = val.find((field) => field.value === key);
                    if (result === undefined) {
                      delete fieldsquery[key];
                      let newFiledsValues = fieldsValues;
                      newFiledsValues[key] = [];
                      setFieldsValues(newFiledsValues);
                    }
                  });
                }}
                options={fieldsChoices.map((field) => {
                  return { label: field[0].toUpperCase() + field.replaceAll("_", " ").slice(1,field.length), value: field };
                })}
              />
            </Box>
          ) : (
            ""
          )}
          {fields.map((field) => {
            switch (field.value) {
              case "device_id":
                const options = devices
                  ? [
                      ...devices.map((dev) => {
                        return {
                          label: `${dev.name}:${dev.id}`,
                          value: dev.id,
                        };
                      }),
                    ]
                  : [];
                return (
                  <Box key={field.value} w={"340px"} p={1}>
                    <Text p={1} color={"text.primary"} fontWeight={"bold"}>
                      {titleDisplayed(field.value)}:
                    </Text>
                    <StyledSelect
                      multi
                      value={
                        fieldsValues[field.value]
                          ? fieldsValues[field.value]
                          : []
                      }
                      options={options}
                      onchange={(val) => {
                        setFiledQueryCall(field.value, val, options);
                        setFieldsValues({
                          ...fieldsValues,
                          [field.value]: val,
                        });
                      }}
                    />
                  </Box>
                );
              case "container_id":
                const options2 = containers
                  ? [
                      ...containers.map((container) => {
                        return { label: container.name, value: container.name };
                      }),
                    ]
                  : [];
                return (
                  <Box key={field.value} w={"340px"} p={1}>
                    <Text p={1} color={"text.primary"} fontWeight={"bold"}>
                      {titleDisplayed(field.value)}:
                    </Text>
                    <StyledSelect
                      multi
                      options={options2}
                      value={
                        fieldsValues[field.value]
                          ? fieldsValues[field.value]
                          : []
                      }
                      onchange={(val) => {
                        setFiledQueryCall(field.value, val, options2);
                        setFieldsValues({
                          ...fieldsValues,
                          [field.value]: val,
                        });
                      }}
                    />
                  </Box>
                );
              case "cytag_id":
                const options3 = deviceCtx.devicesObj.devices.cytag
                  ? [
                      ...deviceCtx.devicesObj.devices.cytag.map((dev) => {
                        return {
                          label: `${dev.name}:${dev.id}`,
                          value: dev.id,
                        };
                      }),
                    ]
                  : [];
                return (
                  <Box key={field.value} w={"340px"} p={1}>
                    <Text p={1} color={"text.primary"} fontWeight={"bold"}>
                      {titleDisplayed(field.value)}:
                    </Text>
                    <StyledSelect
                      multi
                      value={
                        fieldsValues[field.value]
                          ? fieldsValues[field.value]
                          : []
                      }
                      options={options3}
                      onchange={(val) => {
                        setFiledQueryCall(field.value, val, options3);
                        setFieldsValues({
                          ...fieldsValues,
                          [field.value]: val,
                        });
                      }}
                    />
                  </Box>
                );
              case "cylock_id":
                const options4 = deviceCtx.devicesObj.devices.cycollector
                  ? [
                      ...deviceCtx.devicesObj.devices.cycollector.map((dev) => {
                        return {
                          label: `${dev.name}:${dev.id}`,
                          value: dev.id,
                        };
                      }),
                    ]
                  : [];
                return (
                  <Box key={field.value} w={"340px"} p={1}>
                    <Text p={1} color={"text.primary"} fontWeight={"bold"}>
                      {titleDisplayed(field.value)}:
                    </Text>
                    <StyledSelect
                      multi
                      value={
                        fieldsValues[field.value]
                          ? fieldsValues[field.value]
                          : []
                      }
                      options={options4}
                      onchange={(val) => {
                        setFiledQueryCall(field.value, val, options4);
                        setFieldsValues({
                          ...fieldsValues,
                          [field.value]: val,
                        });
                      }}
                    />
                  </Box>
                );
              default:
                return <Box />;
            }
          })}
        </>
      </>
    );
  };

  return (
    <>
      {reportsOptions && (
        <Box
          alignItems={"start"}
          alignContent={"baseline"}
          borderRadius={"10px"}
          p={3}
          bg={"primary.80"}
          mt={2}
          as={Flex}
          flexWrap={"wrap"}
          ml={5}
          mr={5}
          transition={"all 1s"}
          zIndex={2}
          boxShadow={
            darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,1)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <Box w={"340px"} p={1}>
            <Text p={1} color={"text.primary"} fontWeight={"bold"}>
              Devices/Containers:
            </Text>
            <StyledSelect
              value={project}
              general={true}
              required={true}
              onchange={(val) => {
                setProject(val);
                setTableData([]);
                setEntity(-1);
                setFields([]);
                 setActions([]);
                setFieldsquery({});
                setFieldsValues({});
                setActionId([]);
               // setAllActions([]);
                setContainersChoice([])
              }}
              options={[
                { value: "cylocks", label: "CyLocks" },
                { value: "containers", label: "Containers" },
              ]}
            />
          </Box>
          {project === "cylocks" ? CylockForm() : ContainersForm()}

          <Box
          w={"100%"}
            as={Flex}
            alignItems={"start"}
            alignContent={"baseline"}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
          >
            {project === "cylocks" && (
              <Box
                as={Flex}
                mt={-3}
                flexWrap={"wrap"}
                width={isNonMobile ? "none" : '100%'}
              >
                <HistoryPicker
                  selectStartDate={(date) => setStartDate(date)}
                  selectEndDate={(date) => setEndDate(date)}
                  endDate={endDate}
                  startDate={startDate}
                  showBtn={false}
                  width={"340px"}
                  //minW={"340px"}
                />
              </Box>
            )}
            <Box display={'flex'}bg='transparent' alignItems={'flex-end'} justifyContent={'flex-end'} mt={10} mr={7} p={1}>
              <ButtonGroup
                borderRadius={"20px"}
                color={"text.primary"}
                isAttached
                flexDir={isNonMobile ?'row' : 'column'}
                gap={isNonMobile ? 0 : 2}
                bg='transparent'
                variant="outline"
                boxShadow={
                  darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                <Button
                  onClick={handleSelectData}
                  bg={"primary.100"}
                  _hover={{ bg: "primary.60" }}
                  color={"tex.primary"}
                  borderRadius={isNonMobile ? "20px" : 0}
                  borderColor={"primary.60"}
                >
                  Show Data
                </Button>
                <Button
                  onClick={onToggle}
                  bg={"primary.100"}
                  _hover={{ bg: "primary.60" }}
                  color={"tex.primary"}
                  borderRadius={"20px"}
                  borderColor={"primary.60"}
                >
                  Set Scheduling
                </Button>
                <Button
                  onClick={() => navigate("/scheduled-reports")}
                  bg={"primary.100"}
                  _hover={{ bg: "primary.60" }}
                  color={"tex.primary"}
                  borderRadius={isNonMobile ? "20px" : 0}
                  borderColor={"primary.60"}
                >
                  View Scheduled reports
                </Button>
              </ButtonGroup>
            </Box>
          </Box>

          <Box p={1} w={"100%"}>
            <Collapse in={isOpen} animateOpacity>
              <Heading fontSize={"2xl"} color={"text.primary"}>
                Schedule reports
              </Heading>
              <Box
                p={2}
                color="text.primary"
                mt="4"
                rounded="md"
                shadow="md"
                w={"100%"}
                h={"100%"}
              >
                <Form
                  focusOnFirstError
                  showErrorList={false}
                  ref={formRef}
                  formData={
                    formRef.current ? formRef.current.state.formData : {}
                  }
                  schema={formSchema}
                  validator={validator}
                  onSubmit={() => setReportsScheduling()}
                  uiSchema={getReportsUiSchema()}
                  widgets={getFormsWidgets()}
                  templates={{ ObjectFieldTemplate }}
                 
                />
              </Box>
            </Collapse>
          </Box>
        </Box>
      )}
      <Box mt={5} ml={5} mr={5} as={Flex} gap={2} flexWrap={"wrap"}>
            <ComplexTable
              pageNumber={lockReportPage}
              setPageNumber={setLockReportPage}
              hiddenCols={["id", "label", "value"]}
              flatten={true}
              extractFn={extractContainerHeaders}
              data={tableData.map((datum) => flattenObject(datum))}
              title={"Audit Logs"}
              loading={loading}
              height={project === "cylocks" ? "310px" : "310px"}
              width={project === "cylocks" ? 'none' : "300px"}
              icon={
                <Icon as={TbReport} boxSize={"30px"} color={"action.100"} />
              }
            >
              <Box as={Flex} gap={1}>
                <PdfExport
                  title={"Audit logs"}
                  data={prepareReportsForExport(
                    tableData.map((datum) => flattenObject(datum))
                  )}
                />
                <ExcelExport
                  title={"Audit logs"}
                  data={tableData.map((datum) => flattenObject(datum))}
                />
              </Box>
            </ComplexTable>
      </Box>
    </>
  );
}
export default Reports;

import { Box, Flex, Heading, Tag, Spinner, Center } from "@chakra-ui/react";
import React, { useEffect, useState, useContext } from "react";
import HistoryPicker from "../../../ui/history-picker/history-picker";
import LineChart from "../../../ui/charts/line-chart/line-chart";
import PieChart from "../../../ui/charts/pie-chart/pie-chart";
import StyledSelect from "../../../ui/styled-select/styled-select";
import { formatDate } from "../../../../helpers/array-map";
import { getMessagesWithType } from "../../../../api/devices";
import { ThemeContext } from "../../../../context/theme";

function DeviceChart({
  startType = "Cylock Battery",
  mt,
  mb,
  id,
  pie = false,
  options,
  setStartDate,
  startDate,
  endDate,
  setEndDate,
}) {
  const [chartTele, setChartTele] = useState();
  const [chartDataFiltered, setChartDataFiltered] = useState({
    id: "all",
    name: "all",
    data: [],
  });
  const themeCtx = useContext(ThemeContext);
  const [opsFiltered, setOpsFiltered] = useState({
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    xaxis: {
      type: "datetime",
      min: new Date().getTime(),
      tickAmount: 6,
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: undefined,
      shared: true,
      followCursor: true,
      intersect: false,
      inverseOrder: false,
      custom: undefined,
      fillSeriesColor: true,
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      onDatasetHover: {
        highlightDataSeries: false,
      },
      x: {
        show: true,
        format: "dd MMM yyyy, HH:mm",
        formatter: undefined,
      },
      y: {
        formatter: undefined,
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
    grid: {
      show: false,
    },
    legend: {
      show: true,
    },
    fill: {
      type: "gradient",
      shade: "dark",
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 0.5,
      opacityTo: 1,
      stops: [0, 50, 100],
      colorStops: [],
    },
  });
  const [loading, setLoading] = useState(false);
  const getLastTeleByType = (type , reset) => {
    setLoading(true);
    getMessagesWithType(type + "", "50", id, reset ? '' : startDate, reset ? '' : endDate)
      .then((res) => {
        const filtered = res.data.data[type + ""].reverse();
        let chartName = "";
        let chartType;
        if (options) {
          chartType = options.find((op) => op.value === parseInt(chartTele));
          if (chartType) {
            chartName = chartType.label;
          }
        }
        setChartDataFiltered({
          id: chartTele,
          name: chartName,
          data: filtered.map((dat) => [
            new Date(dat.message_time),
            parseFloat(dat.message_value),
          ]),
        });
        const dataSeries = filtered.map((point) => {
          return formatDate(point.message_time);
        });
        setOpsFiltered(
          Object.assign(opsFiltered, {
            colors: [themeCtx.darkMode ? "#7551FF" : "#4318FF"],
            stroke: {
              curve: chartType.graph_type === "binary" ? "stepline" : "smooth",
            },
            xaxis: {
              categories: dataSeries,
              type: "datetime",
              min: new Date(
                filtered.length !== 0 && filtered[0].message_time + "Z"
              ).getTime(),
              tickAmount: 6,
              labels: {
                show: true,
                datetimeFormatter: {
                  year: "yyyy",
                  month: "MMM 'yy",
                  day: "dd MMM",
                  hour: "HH:mm",
                },
              },
            },
            tooltip: {
              enabled: true,
              enabledOnSeries: undefined,
              shared: true,
              followCursor: true,
              intersect: false,
              inverseOrder: false,
              custom: undefined,
              fillSeriesColor: true,
              style: {
                fontSize: "12px",
                fontFamily: undefined,
              },
              onDatasetHover: {
                highlightDataSeries: false,
              },
              x: {
                show: true,
                format: "dd MMM yyyy, HH:mm",
              },
            },
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (chartTele) {
      getLastTeleByType(chartTele);
    }
  }, [chartTele, themeCtx]);

  useEffect(() => {
    if (options.length !== 0 && !chartTele) {
      setChartTele(options.find((op) => op.label === startType).value);
    }
  }, [options]);

  const getLabel = () => {
    if (startDate !== '' && endDate !== '') {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else {
      return "Last 50 Messages";
    }
  };
  const getChartTitle = () => {
    const type = options.find((title) => title.value === parseInt(chartTele));
    if (type) {
      return type.label;
    } else {
      return "";
    }
  };
  return (
    <Box
    
      mb={mb}
      mt={mt}
      p={2}
      width={'100%'}
      bg={"primary.80"}
      borderRadius={"10px"}
      boxShadow={
        themeCtx.darkMode
          ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
          : "5px 4px 15px 1px rgba(0,0,0,0.2)"
      }
    >
      <Box
        flexWrap={"wrap"}
        pr={2}
        flexDir={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={2}
        as={Flex}
        my={4}
      >
        <Heading display={'flex'} alignItems={'center'} fontSize={"2xl"} ml={4} color={"text.primary"} minW={"40px"}>
          {chartTele && chartTele !== "-1"
            ? getChartTitle()[0].toUpperCase() +
              getChartTitle().slice(1, getChartTitle().length)
            : ""}{" "}
          {" Chart"}
        </Heading>
        <Box fontSize={"md"} pr={4} pl={4} display={'flex'} alignItems={'center'}>
          <Tag
            fontSize={"md"}
            p={2}
            color={"text.primary"}
            fontWeight={"semibold"}
            bg={"primary.100"}
          >
            {getLabel()}
          </Tag>
        </Box>
        <Box
          as={Flex}
          gap={2}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          pr={2}
          pl={4}
        >
          <HistoryPicker
            selectStartDate={(date) => setStartDate(date)}
            handleClick={() => getLastTeleByType(chartTele , false)}
            selectEndDate={(date) => setEndDate(date)}
            disabled={!startDate || !endDate}
            startDate={startDate}
            endDate={endDate}
            loading={loading}
            endDateRequired={true}
            reset={() => getLastTeleByType(chartTele , true)}
          />
          <StyledSelect
            options={options}
            value={chartTele}
            onchange={setChartTele}
          />
        </Box>
      </Box>
      <Box p={4}>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          flexWrap={"wrap"}
          borderRadius={"10px"}
          bg={loading ? "transparent" : "primary.100"}
          w={"100%"}
          boxShadow={
            loading
              ? "None"
              : themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          {loading ? (
            <Center minH={"400px"} w={"100%"}>
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
            </Center>
          ) : (
            <Box mt={4} w={"100%"}>
              {pie ? (
                <PieChart ops={opsFiltered} data={chartDataFiltered} />
              ) : (
                <LineChart data={[chartDataFiltered]} ops={opsFiltered} />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default DeviceChart;

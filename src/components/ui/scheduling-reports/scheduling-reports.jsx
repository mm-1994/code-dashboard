import React, { useState, useEffect } from "react";
import { Box, Heading } from "@chakra-ui/react";
import ObjectFieldTemplate from "../../form-widgets/custom-object";
import Form from "@rjsf/chakra-ui";
import validator from "@rjsf/validator-ajv8";
import {
    createScheduledReportsAlarms,
    getScheduledReportsOptions,
} from "../../../api/reports";
import { showsuccess } from "../../../helpers/toast-emitter";
import { getReportsUiSchema } from "../../../data/reports";
import { getFormsWidgets } from "../../../data/alarms";

function SchedulingReports({ reportQueryParams }) {
    const formRef = React.useRef(null);
    const [formSchema, setFormSchema] = useState({});

    useEffect(() => {
        getScheduledReportsOptions()
    }, []);

    const setReportsScheduling = () => {
        createScheduledReportsAlarms({
            report_query_params: reportQueryParams(),
            scheduled_report_options: Object.assign(formRef.current.state.formData, {
                scheduled_at: formRef.current.state.formData.scheduled_at.replace(
                    "Z",
                    ""
                ),
            }),
        }).then((res) => showsuccess("Successfully added scheduled reports"));
    };

    return (
        <>
            <Heading fontSize={"2xl"} color={"text.primary"}>
                Schedule Reports
            </Heading>
            <Box
                p={2}
                color="text.primary"
                mt="4"
                w={"100%"}
                h={"100%"}
            >
                <Form
                    focusOnFirstError
                    showErrorList={false}
                    ref={formRef}
                    formData={formRef.current ? formRef.current.state.formData : {}}
                    schema={formSchema}
                    validator={validator}
                    onSubmit={() => setReportsScheduling()}
                    uiSchema={getReportsUiSchema()}
                    widgets={getFormsWidgets()}
                    templates={{ ObjectFieldTemplate }}
                />
            </Box>
        </>
    );
}

export default SchedulingReports;

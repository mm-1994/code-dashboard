import React, { useEffect, useState, useContext } from 'react';
import ComplexTable from '../../../ui/table/complex-table';
import { GrScheduleNew } from 'react-icons/gr';
import { getScheduledReports } from '../../../../api/reports';
import { flattenObject } from '../../../../helpers/array-map';
import {
    Box,
  } from "@chakra-ui/react";

function ScheduledReports () {
    const [scheduledReports, setScheduledReports] = useState([]);
    useEffect(() => {
        getScheduledReports().then((res) => {
            setScheduledReports(res.data.scheduled_reports.map((report) => flattenObject(report)));
        });
    }, []);
    return (
        <Box px={5}>
        <ComplexTable
            data={scheduledReports}
            icon={<GrScheduleNew  color='red' />}
            title={'Scheduled Reports'}
        />
        </Box>
    );
}

export default ScheduledReports;

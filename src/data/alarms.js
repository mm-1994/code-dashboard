import React, { useContext } from "react";

import CustomCheckbox from '../components/form-widgets/custom-checkbox';
import CustomNumberInput from '../components/form-widgets/custom-input';
import CustomSelect from '../components/form-widgets/custom-select';
import CustomDateTime from '../components/form-widgets/custom-dateTime';
import { ThemeContext } from '../context/theme';

export const SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

export const ALARM_STATUS = {
    ACTIVE: 'active',
    ACKNOWLEDGED: 'acknowledged',
    RESOLVED: 'resolved',
    CLEARED: 'cleared'
};

export const GEOFENCE_TYPE = {
    ASSERT_IN: "Outside geofence",
    ASSERT_OUT: "Inside geofence"
}

export function createAlarmSettingSchema (alarmTypes, geofences, routes) {

    return {
        type: 'object',
        properties: {
            alarm_type: {
                enum: alarmTypes.map((type) => {
                    return type.name;
                }),
                type: 'string'
            },
            severity: {
                type: 'string',
                enum: Object.values(SEVERITY)
            },
            enabled: {
                type: 'boolean'
            }
        },
        allOf: alarmTypes.map((type) => {

            return {
                if: {
                    properties: {
                        alarm_type: {
                            const: type.name
                        }
                    }
                },
                then: type.configurations_schema
            };
        })
    };
}

export function getAlarmSettingUiSchema (unedit = [], editFlag = false, geofences, routes) {
    const theme = useContext(ThemeContext)
    let ui = {};
    if (editFlag) {
        ui = {
            'ui:submitButtonOptions': {
                submitText: 'Submit',
                norender: false,
                props: {
                    bg: 'primary.60',
                    boxShadow: 
                        theme.darkMode
                          ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                          : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                }
            },
            alarm_type: {
                'ui:disabled': true
            }
        };
        unedit && unedit.forEach((element) => {
            ui[element] = {
                'ui:disabled': true
            };
        });
    } else {
        ui = {
            'ui:submitButtonOptions': {
                submitText: 'Create Configurations',
                norender: false,
                props: {
                    disabled: false,
                    bg: 'primary.60',
                    boxShadow: 
                        theme.darkMode
                          ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                          : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                      
                
                }
            },
            route_name: {
                disabled: routes.length === 0
            },
            geofence_name: {
                disabled: geofences.length === 0
            }
        };
    }
    return ui;
}
export function getNotificationsSettingUiSchema () {
    return {
        'ui:submitButtonOptions': {
            submitText: 'Update Configurations',
            norender: false,
            props: {
                disabled: false,
                bg: 'action.100'
            }
        }
    };
}

export function getFormsWidgets () {
    return {
        SelectWidget: CustomSelect,
        TextWidget: CustomNumberInput,
        CheckboxWidget: CustomCheckbox,
        EmailWidget: CustomNumberInput,
        DatetimeWidget: CustomDateTime
    };
}

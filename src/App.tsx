  import React, { useState, useEffect } from 'react';
  import { Container, Grid, TextField, Button, Typography, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
  import { Formik, Form, Field, useFormikContext } from 'formik';
  import * as Yup from 'yup';
  import { ObjectSchema } from 'yup';
  import Editor from "@monaco-editor/react";
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
  import './App.css';

  import * as configurations from './examples';
  const configurationOptions = Object.keys(configurations);

  interface Option {
    value: string;
    label: string;
  }

  interface FormField {
    name: string;
    label: string;
    type: string;
    validation: string;
    outputPath: string;
    options?: Option[];
    min?: number;
    max?: number;
    multiple?: boolean;
    show?: { field: string; equals: string }[];
  }

  interface FormValues {
    [key: string]: any;
  }

  const getNestedObjectFromFormValues = (fields: FormField[], values: FormValues): object => {
    let output: { [key: string]: any } = {};
    fields.forEach(field => {
      if (!shouldDisplayField(field, values)) {
        return;
      }
      const keys = field.outputPath.split('.');
      keys.reduce((acc: any, key: string, index: number) => {
        if (index === keys.length - 1) {
          acc[key] = values[field.name];
          return null;
        }
        acc[key] = acc[key] || {};
        return acc[key];
      }, output);
    });
    return output;
  };

  const shouldDisplayField = (field: FormField, values: FormValues): boolean => {
    if (!field.show || field.show.length === 0) {
      return true;
    }
    return field.show.every(condition => values[condition.field] === condition.equals);
  };

  interface DynamicFieldProps {
    field: FormField;
  }

  const DynamicField: React.FC<DynamicFieldProps> = ({ field }) => {
    const { setFieldValue, values } = useFormikContext<FormValues>();

    if (!shouldDisplayField(field, values)) {
      return null;
    }

    switch (field.type) {
      case 'text':
      case 'number':
        return <Field as={TextField} className="form-field" name={field.name} label={field.label} type={field.type} fullWidth margin="normal" />;
      case 'select':
        return (
          <FormControl className="form-field" fullWidth margin="normal">
            <InputLabel>{field.label}</InputLabel>
            <Field as={Select} name={field.name} label={field.label} multiple={field.multiple || false}
              renderValue={(selected: any) => typeof selected === 'string' ? selected : selected.join(', ')}
            >
              {field.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Field>
          </FormControl>
        );
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="form-field"
              label={field.label}
              value={values[field.name] || null}
              onChange={(value) => setFieldValue(field.name, value)}
            />
          </LocalizationProvider>
        );
      default:
        return null;
    }
  };

  const App: React.FC = () => {
    const [selectedConfig, setSelectedConfig] = useState<string>('attendee');
    const [formJson, setFormJson] = useState<string>(JSON.stringify(configurations[selectedConfig], null, 2));
    const [formDefinition, setFormDefinition] = useState<any>(configurations[selectedConfig]);

    const handleConfigChange = (event: SelectChangeEvent<string>) => {
      const newConfig = event.target.value;
      setSelectedConfig(newConfig);
      const newFormJson = JSON.stringify(configurations[newConfig], null, 2);
      setFormJson(newFormJson);
      const newFormDefinition = configurations[newConfig];
      setFormDefinition(newFormDefinition);
    };

    useEffect(() => {
      setFormJson(JSON.stringify(configurations[selectedConfig], null, 2));
    }, [selectedConfig]);

    useEffect(() => {
      try {
        const parsedJson = JSON.parse(formJson);
        setFormDefinition(parsedJson);
      } catch (error) {
        console.error("Error parsing JSON", error);
      }
    }, [formJson]);

    const getInitialValues = (fields: FormField[]): FormValues => {
      return fields.reduce((acc, field) => {
        acc[field.name] = field.multiple ? [] : '';
        return acc;
      }, {});
    };

    const generateFormValidationSchema = (fields: FormField[], formValues: FormValues) => {
      let schemaFields: { [key: string]: Yup.AnySchema } = {};
    
      fields.forEach((field) => {
        if (shouldDisplayField(field, formValues)) {
          let schema;
          switch (field.type) {
            case "text":
              schema = Yup.string();
              break;
            case "number":
              schema = Yup.number()
                .transform((value, originalValue) => String(originalValue).trim() === "" ? undefined : value)
                .typeError('Please enter a valid number');
              if (field.min !== undefined) {
                schema = schema.min(field.min, `Must be at least ${field.min}`);
              }
              if (field.max !== undefined) {
                schema = schema.max(field.max, `Must be no more than ${field.max}`);
              }
              break;
            case "select":
              schema = field.multiple ? Yup.array().of(Yup.string()) : Yup.string();
              if (field.multiple) {
                schema = schema.min(1, "At least one selection is required");
              }
              break;
            case "date":
              schema = Yup.date().typeError('Please enter a valid date');
              break;
            default:
              schema = Yup.mixed();
          }
    
          // Only add required validation if explicitly marked as required
          if (field.validation === "required") {
            schema = schema.required("Required");
          }
    
          schemaFields[field.name] = schema;
        }
      });
    
      return Yup.object().shape(schemaFields);
    };    

    const initialValues = getInitialValues(formDefinition.fields);
    const [validationSchema, setValidationSchema] = useState<ObjectSchema<FormValues>>(Yup.object().shape({}));

    useEffect(() => {
      const newSchema = generateFormValidationSchema(formDefinition.fields, initialValues);
      setValidationSchema(newSchema);
    }, [formDefinition, initialValues]);

    return (
      <Container maxWidth="lg">
        <Grid container spacing={3} style={{ paddingTop: "60px" }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="config-select-label">Examples</InputLabel>
              <Select
                labelId="config-select-label"
                id="config-select"
                value={selectedConfig}
                label="Examples"
                onChange={handleConfigChange}
              >
                {configurationOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">JSON Editor</Typography>
            <Editor
              key={selectedConfig}
              height="500px"
              defaultLanguage="json"
              value={formJson}
              onChange={(value) => setFormJson(value || '')}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Form Preview</Typography>
            {formDefinition.fields.length > 0 && (
              <Formik
                key={selectedConfig}
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting }) => {
                  const nestedObject = getNestedObjectFromFormValues(formDefinition.fields, values);
                  alert(JSON.stringify(nestedObject, null, 2));
                  setSubmitting(false);
                }}
                validateOnChange={true}
                validate={(values) => {
                  const validationSchema = generateFormValidationSchema(formDefinition.fields, values);

                  try {
                    validationSchema.validateSync(values, { abortEarly: false });
                  } catch (err) {
                    if (err instanceof Yup.ValidationError) {
                      return err.inner.reduce((acc: Record<string, string>, currentError: Yup.ValidationError) => {
                        acc[currentError.path!] = currentError.message;
                        return acc;
                      }, {});
                    }
                  }
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    {formDefinition.fields.map(field => (
                      <React.Fragment key={field.name}>
                        <DynamicField field={field} />
                        {errors[field.name] && touched[field.name] ? (
                          <Typography color="error">{String(errors[field.name])}</Typography>
                        ) : null}
                      </React.Fragment>
                    ))}
                    <Button className="submit-button" type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Grid>
        </Grid>
      </Container>
    );
  };

  export default App;
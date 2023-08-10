import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  type: yup.string().oneOf(['Bug', 'User Story']).required('Type is required'),
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required')
});

export const workItemTypes = [
  { id: 'Bug', name: 'Bug' },
  { id: 'User Story', name: 'Feature' }
];

export const severityLevels = [
  { id: '2 - High', name: 'High' },
  { id: '3 - Medium', name: 'Medium' },
  { id: '4 - Low', name: 'Low' }
];

export const workItemStates = [
  { id: 'New', name: 'New' },
  { id: 'Active', name: 'Active' },
  { id: 'Closed', name: 'Closed' }
];

export const handleDescriptionChange = (value, workItem) => {
  workItem.description = value;
};

export const handleNewDescriptionChange = (value, formik) => {
  console.log(formik);
  formik.values.description = value;
};

export const handleTitleChange = (event, workItem) => {
  workItem.title = event?.target?.value;
};

export const openNewWorkItem = (setNewWorkItemOpen) => {
  setNewWorkItemOpen(true);
};
export const closeNewWorkItem = (setNewWorkItemOpen) => {
  setNewWorkItemOpen(false);
};

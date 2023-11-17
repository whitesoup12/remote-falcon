import MoneyOffTwoToneIcon from '@mui/icons-material/MoneyOffTwoTone';
import WorkspacePremiumTwoToneIcon from '@mui/icons-material/WorkspacePremiumTwoTone';
import _ from 'lodash';

export const tabOptions = [
  {
    label: 'Free Templates',
    icon: <MoneyOffTwoToneIcon />,
    caption: 'Free Templates'
  },
  {
    label: 'Premium Templates',
    icon: <WorkspacePremiumTwoToneIcon />,
    caption: 'Premium Templates'
  }
];

export const handleTemplateChange = (event, value, remoteViewerPageTemplates, setSelectedTemplate, setSelectedTemplateBase64) => {
  _.map(remoteViewerPageTemplates, (template) => {
    if (value.label === template?.title) {
      setSelectedTemplate(value);
      const templateBase64 = `data:text/html;base64,${btoa(unescape(encodeURIComponent(template?.content)))}`;
      setSelectedTemplateBase64(templateBase64);
    }
  });
};

import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const ReactSyntaxHighlighter = ({ codeString, showLineNumbers = true }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        fontSize: '1rem !important',
        overflow: 'hidden',
        '& pre': {
          margin: 0,
          padding: '16px !important',
          fontFamily: theme.typography.fontFamily,
          bgcolor: theme.palette.mode === 'dark' ? `${theme.palette.grey[50]} !important` : `${theme.palette.grey[900]} !important`
        }
      }}
    >
      <SyntaxHighlighter
        language="javacript"
        showLineNumbers={showLineNumbers}
        style={theme.palette.mode === 'dark' ? a11yLight : a11yDark}
      >
        {codeString}
      </SyntaxHighlighter>
    </Card>
  );
};

ReactSyntaxHighlighter.propTypes = {
  codeString: PropTypes.string,
  showLineNumbers: PropTypes.bool
};

export default ReactSyntaxHighlighter;

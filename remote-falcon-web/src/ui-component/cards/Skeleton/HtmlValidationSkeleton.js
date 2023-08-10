import { TableRow, TableCell, TableContainer, Table, TableHead, TableBody } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const HtmlValidationSkeleton = () => (
  <TableContainer>
    <Table sx={{ minWidth: 350 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell align="left" />
          <TableCell align="left" />
          <TableCell align="left" />
        </TableRow>
      </TableHead>
      <TableBody className="validation">
        <TableRow hover>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
          <TableCell align="left">
            <Skeleton variant="text" height={45} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export default HtmlValidationSkeleton;

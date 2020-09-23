import { TableRow, TableCell } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const TableRowSkeleton = ({ cols }) => (
  <TableRow>
    {[...Array(cols).keys()].map((i) => (
      <TableCell key={i}>
        <Skeleton animation="wave" />
      </TableCell>
    ))}
  </TableRow>
);

export default TableRowSkeleton;

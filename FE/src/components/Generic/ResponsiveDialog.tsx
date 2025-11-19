import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export interface ResponsiveDialogProps {
  open: boolean,
  dialogTitle?: string,
  dialogContent: string,
  cancelButtonText?: string,
  confirmButtonText?: string,
  onCancel?: () => void,
  onConfirm: () => void,
}

export default function ResponsiveDialog({open, dialogTitle = "Confirmation Dialog", dialogContent, cancelButtonText = "Cancel", confirmButtonText = "Confirm", onCancel, onConfirm }: ResponsiveDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <React.Fragment>
      <Dialog fullScreen={fullScreen} open={open} onClose={onCancel} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* TODO: Modify after the Theme Related Task, they are kinda ugly*/}
          <Button variant="contained" color="secondary" onClick={onCancel}>
            {cancelButtonText}
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
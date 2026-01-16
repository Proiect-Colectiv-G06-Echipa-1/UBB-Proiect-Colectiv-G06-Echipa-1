/**
 * @file ResponsiveDialog.tsx
 * @brief Generic responsive dialog component for confirmations.
 */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { fontFamilyStyle, fontSizeStyle } from '../../lib/style';

/**
 * @interface ResponsiveDialogProps
 * @brief Props for the ResponsiveDialog component.
 */
export interface ResponsiveDialogProps {
  open: boolean; ///< Whether the dialog is open.
  dialogTitle?: string; ///< Title of the dialog.
  dialogContent: string; ///< Content message of the dialog.
  cancelButtonText?: string; ///< Text for the cancel button.
  confirmButtonText?: string; ///< Text for the confirm button.
  onCancel?: () => void; ///< Callback when cancel is clicked.
  onConfirm: () => void; ///< Callback when confirm is clicked.
}

/**
 * @brief A dialog that adjusts its size based on the screen width.
 * @return The rendered ResponsiveDialog component.
 */
export default function ResponsiveDialog({open, dialogTitle = "Confirmation Dialog", dialogContent, cancelButtonText = "Cancel", confirmButtonText = "Confirm", onCancel, onConfirm }: ResponsiveDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <React.Fragment>
      <Dialog fullScreen={fullScreen} open={open} onClose={onCancel} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" sx={[fontFamilyStyle, {fontSize: "32px"}]}>
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={[fontFamilyStyle, fontSizeStyle]}>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* TODO: Modify after the Theme Related Task, they are kinda ugly*/}
          <Button variant="contained" color="secondary" onClick={onCancel} sx={[fontFamilyStyle, fontSizeStyle]}>
            {cancelButtonText}
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm} sx={[fontFamilyStyle, fontSizeStyle]}>
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
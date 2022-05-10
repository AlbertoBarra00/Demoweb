import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordModule } from "primeng/password";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenubarModule } from 'primeng/menubar';
import { InputMaskModule } from 'primeng/inputmask';
import { ContextMenuModule } from 'primeng/contextmenu';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    CommonModule,
    PasswordModule,
    DividerModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TableModule,
    CardModule,
    MessageModule,
    MessagesModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    CalendarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    MenubarModule,
    InputMaskModule,
    ContextMenuModule
  ]
})
export class PrimeNgModule { }

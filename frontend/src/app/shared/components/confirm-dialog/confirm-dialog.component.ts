import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog">
      <p class="confirm-dialog__message">Are you sure?</p>
      <div class="confirm-dialog__actions">
        <button class="confirm-dialog__cancel" type="button">Cancel</button>
        <button class="confirm-dialog__confirm" type="button">Confirm</button>
      </div>
    </div>
  `,
  styles: [
    `.confirm-dialog { display: grid; gap: .75rem; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; background: rgba(255,255,255,.98); }`,
    `.confirm-dialog__actions { display: flex; justify-content: flex-end; gap: .5rem; }`,
    `.confirm-dialog__confirm { background: #1e88e5; color: #fff; border: none; padding: .5rem 1rem; border-radius: .5rem; }`
  ]
})
export class ConfirmDialogComponent {}
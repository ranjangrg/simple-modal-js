# simple-modal-js
Simple modal generator with accessibility in mind.

## Usage
`index.html` shows what files to import within the html; namely `modal.css` and `modal.js`.
```html
<!-- make sure to set class as "open-modal-btn", "data-target-modal" with modal-content's id  -->
<button 
    type="button" id="{open-modal-btn-id}" class="open-modal-btn" 
    data-modal-title="{Modal title}" data-target-modal="{modal-content-id}"> 
    {button label} 
</button>
<div id="{modal-content-id}">
    {Modal 1 content}
</div>
```

## Accessibility
Currently it supports `focus-trap` i.e. when modal is opened, the keyboard focus is trapped within the modal.
Aria features like `aria-label`, `aria-expanded` etc are used.
More accessibility features to follow.

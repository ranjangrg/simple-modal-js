# simple-modal-js
Simple modal generator with accessibility in mind.

## Usage
`index.html` shows what files to import within the html; namely `modal.css` and `modal.js`
Additional script is needed to create helper object and initiate modal implementation.

## Accessibility
Currently it supports `focus-trap` i.e. when modal is opened, the keyboard focus is trapped within the modal.
Aria features like `aria-label`, `aria-expanded` etc are used.
More accessibility features to follow.

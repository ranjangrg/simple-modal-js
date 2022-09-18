var ModalController = /** @class */ (function () {
    function ModalController(props) {
        this.closeSymbolDim = 1 * this.getDocumentRootFontSizeInPixels(); // 1rem
        this.closeSymbol = "<svg xmlns=\"http://www.w3.org/2000/svg\" \n        width=\"".concat(this.closeSymbolDim, "\" height=\"").concat(this.closeSymbolDim, "\" \n        viewBox=\"0 0 ").concat(this.closeSymbolDim, " ").concat(this.closeSymbolDim, "\" \n        overflow=\"visible\" stroke=\"white\" stroke-width=\"5\" stroke-linecap=\"round\">\n        <line x2=\"").concat(this.closeSymbolDim, "\" y2=\"").concat(this.closeSymbolDim, "\" />\n        <line x1=\"").concat(this.closeSymbolDim, "\" y2=\"").concat(this.closeSymbolDim, "\" />\n    </svg>");
        this.modalBtnElem = document.getElementById(props.modalBtnElemId);
        this.modalContent = props.modalContent;
        this.modalTitle = props.modalTitle;
        this.modalContentElem = null;
        this.createModalElement();
        this.attachModalContent();
        this.initEventTriggers();
        this.trapFocusWithinModal();
    }
    ModalController.prototype.getDocumentRootFontSizeInPixels = function () {
        // basic conversion from 1rem to px: Note: no null checks in place currently
        return parseFloat(getComputedStyle(document.querySelector('html')).fontSize.replace("px", ""));
    };
    ModalController.prototype.createModalElement = function () {
        // main modal content container
        var modalContentContainerElem = document.createElement("div");
        modalContentContainerElem.setAttribute("id", this.modalBtnElem.id + "-modal-container");
        modalContentContainerElem.setAttribute("class", "modal-container");
        modalContentContainerElem.setAttribute("role", "dialog");
        modalContentContainerElem.setAttribute("aria-modal", "true");
        modalContentContainerElem.setAttribute("aria-expanded", "false");
        modalContentContainerElem.setAttribute("aria-hidden", "true");
        // close modal btn
        var modalCloseBtnElem = document.createElement("button");
        modalCloseBtnElem.setAttribute("class", "close-modal-btn");
        modalCloseBtnElem.setAttribute("aria-label", "Close this modal/dialog");
        modalCloseBtnElem.innerHTML = this.closeSymbol;
        // close modal btn container
        var modalCloseBtnContainerElem = document.createElement("div");
        modalCloseBtnContainerElem.setAttribute("class", "close-modal-container");
        modalCloseBtnContainerElem.append(modalCloseBtnElem);
        // close modal btn label
        var modalCloseBtnLabelElem = document.createElement("div");
        modalCloseBtnLabelElem.setAttribute("class", "close-modal-btn-label");
        modalCloseBtnLabelElem.setAttribute("aria-hidden", "true");
        modalCloseBtnLabelElem.textContent = "Close modal";
        modalCloseBtnContainerElem.append(modalCloseBtnLabelElem);
        // main modal content
        var modalContentElem = document.createElement("div");
        modalContentElem.setAttribute("class", "modal-content");
        modalContentElem.innerHTML = this.modalContent;
        // main modal title
        var modalTitleElem = document.createElement("div");
        modalTitleElem.setAttribute("class", "modal-title");
        modalTitleElem.textContent = this.modalTitle;
        // main modal content wrapper
        var modalContentWrapperElem = document.createElement("div");
        modalContentWrapperElem.setAttribute("class", "modal-content-wrapper");
        modalContentWrapperElem.append(modalTitleElem);
        modalContentWrapperElem.append(modalContentElem);
        // add all elements next to the open modal btn in DOM
        modalContentContainerElem.append(modalCloseBtnContainerElem);
        modalContentContainerElem.append(modalContentWrapperElem);
        this.modalContentElem = modalContentContainerElem;
    };
    ModalController.prototype.attachModalContent = function () {
        this.modalBtnElem.parentNode.insertBefore(this.modalContentElem, this.modalBtnElem.nextSibling);
    };
    ModalController.prototype.initEventTriggers = function () {
        var mainObj = this;
        // click on background to close modal
        this.modalContentElem.addEventListener("click", function (e) {
            if (e.srcElement === mainObj.modalContentElem) {
                // only if background is clicked
                mainObj.closeModal(mainObj.modalContentElem);
            }
        }.bind(this.modalContentElem));
        // open modal
        this.modalBtnElem.addEventListener("click", function () {
            mainObj.openModal();
        }.bind(mainObj));
        // close modal 
        var closeModalElems = this.modalContentElem.getElementsByClassName("close-modal-container");
        for (var idx = 0; idx < closeModalElems.length; ++idx) {
            var elem = closeModalElems.item(idx);
            elem.addEventListener("click", function (e) {
                mainObj.closeModal(mainObj.modalContentElem);
            }.bind(mainObj));
        }
        ;
    };
    ModalController.prototype.closeModal = function (modalElem) {
        modalElem.setAttribute("aria-expanded", "false");
        modalElem.setAttribute("aria-hidden", "true");
        modalElem.classList.remove("show");
    };
    ModalController.prototype.openModal = function () {
        this.modalContentElem.setAttribute("aria-expanded", "true");
        this.modalContentElem.setAttribute("aria-hidden", "false");
        // this.modalContentElem.setAttribute("tabIndex", "0");
        this.modalContentElem.classList.add("show");
    };
    ModalController.prototype.trapFocusWithinModal = function () {
        var focusableElements = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
        var firstFocusableElement = this.modalContentElem.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
        var focusableContent = this.modalContentElem.querySelectorAll(focusableElements);
        var lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal
        this.modalContentElem.addEventListener('keydown', function (e) {
            var isTabPressed = e.key === 'Tab' || e.keyCode === 9;
            if (!isTabPressed) {
                return;
            }
            if (e.shiftKey) { // if shift key pressed for shift + tab combination
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus(); // add focus for the last focusable element
                    e.preventDefault();
                }
            }
            else { // if tab key is pressed
                if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                    firstFocusableElement.focus(); // add focus for the first focusable element
                    e.preventDefault();
                }
            }
        });
    };
    return ModalController;
}());
// END OF FILE 
//# sourceMappingURL=modal.js.map
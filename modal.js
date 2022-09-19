var ModalController = /** @class */ (function () {
    function ModalController(props) {
        this.closeSymbolDim = 1 * this.getDocumentRootFontSizeInPixels(); // 1rem
        this.closeSymbol = "<svg xmlns=\"http://www.w3.org/2000/svg\" \n        width=\"".concat(this.closeSymbolDim, "\" height=\"").concat(this.closeSymbolDim, "\" \n        viewBox=\"0 0 ").concat(this.closeSymbolDim, " ").concat(this.closeSymbolDim, "\" \n        overflow=\"visible\" stroke=\"white\" stroke-width=\"5\" stroke-linecap=\"round\">\n        <line x2=\"").concat(this.closeSymbolDim, "\" y2=\"").concat(this.closeSymbolDim, "\" />\n        <line x1=\"").concat(this.closeSymbolDim, "\" y2=\"").concat(this.closeSymbolDim, "\" />\n    </svg>");
        this.modalBtnElem = document.getElementById(props.modalBtnElemId);
        this.modalContent = props.modalContent;
        // this.modalTitle = props.modalTitle;
        this.modalTitle = this.modalBtnElem.dataset.modalTitle;
        this.modalWrapperElem = null;
        this.modalContentElem = document.getElementById(this.modalBtnElem.dataset.targetModal);
        this.modalContentElem.classList.add("modal-content"); // assign proper classname
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
        var _modalContentContainerElem = document.createElement("div");
        _modalContentContainerElem.setAttribute("id", this.modalContentElem.id + "-modal-container");
        _modalContentContainerElem.setAttribute("class", "modal-container");
        _modalContentContainerElem.setAttribute("role", "dialog");
        _modalContentContainerElem.setAttribute("aria-modal", "true");
        _modalContentContainerElem.setAttribute("aria-expanded", "false");
        _modalContentContainerElem.setAttribute("aria-hidden", "true");
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
        var _modalCloseBtnLabelElem = document.createElement("div");
        _modalCloseBtnLabelElem.setAttribute("class", "close-modal-btn-label");
        _modalCloseBtnLabelElem.setAttribute("aria-hidden", "true");
        _modalCloseBtnLabelElem.textContent = "Close modal";
        modalCloseBtnContainerElem.append(_modalCloseBtnLabelElem);
        // main modal content
        var _modalContentElem = document.createElement("div");
        _modalContentElem.setAttribute("class", "modal-content");
        _modalContentElem.innerHTML = this.modalContent;
        // main modal title; is above main modal container within the background
        var _modalTitleElem = document.createElement("div");
        _modalTitleElem.setAttribute("class", "modal-title");
        _modalTitleElem.textContent = this.modalTitle;
        // main modal content wrapper
        var _modalContentWrapperElem = document.createElement("div");
        _modalContentWrapperElem.setAttribute("class", "modal-content-wrapper");
        _modalContentWrapperElem.append(_modalTitleElem);
        //modalContentWrapperElem.append(_modalContentElem);
        _modalContentWrapperElem.append(this.modalContentElem);
        // add all elements next to the open modal btn in DOM
        _modalContentContainerElem.append(modalCloseBtnContainerElem);
        _modalContentContainerElem.append(_modalContentWrapperElem);
        this.modalWrapperElem = _modalContentContainerElem;
    };
    ModalController.prototype.updateModalContent = function (newContent) {
        this.modalContentElem.innerHTML = newContent;
    };
    ModalController.prototype.updateModalTitle = function (newContent) {
        this.modalTitle = newContent;
    };
    ModalController.prototype.attachModalContent = function () {
        this.modalBtnElem.parentNode.insertBefore(this.modalWrapperElem, this.modalBtnElem.nextSibling);
    };
    ModalController.prototype.initEventTriggers = function () {
        var mainObj = this;
        // click on background to close modal
        this.modalWrapperElem.addEventListener("click", function (e) {
            if (e.srcElement === mainObj.modalWrapperElem) {
                // only if background is clicked
                mainObj.closeModal(mainObj.modalWrapperElem);
            }
        }.bind(this.modalWrapperElem));
        // open modal
        this.modalBtnElem.addEventListener("click", function () {
            mainObj.openModal();
        }.bind(mainObj));
        // close modal 
        var closeModalElems = this.modalWrapperElem.getElementsByClassName("close-modal-container");
        for (var idx = 0; idx < closeModalElems.length; ++idx) {
            var elem = closeModalElems.item(idx);
            elem.addEventListener("click", function (e) {
                mainObj.closeModal(mainObj.modalWrapperElem);
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
        this.modalWrapperElem.setAttribute("aria-expanded", "true");
        this.modalWrapperElem.setAttribute("aria-hidden", "false");
        // this.modalContentElem.setAttribute("tabIndex", "0");
        this.modalWrapperElem.classList.add("show");
    };
    ModalController.prototype.trapFocusWithinModal = function () {
        var focusableElements = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
        var firstFocusableElement = this.modalWrapperElem.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
        var focusableContent = this.modalWrapperElem.querySelectorAll(focusableElements);
        var lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal
        this.modalWrapperElem.addEventListener('keydown', function (e) {
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
document.addEventListener("DOMContentLoaded", function () {
    var openModalBtns = document.getElementsByClassName("open-modal-btn");
    for (var idx = 0; idx < openModalBtns.length; ++idx) {
        var btn = openModalBtns[idx];
        // not sure how JS garbage-collector handles this controller object.
        // haven't tested extensively on lifetime of this controller object and 
        // modal event handlers like close-modal, open-modal etc.
        var modalController = new ModalController({
            modalBtnElemId: btn.id
        });
    }
});
// END OF FILE 
//# sourceMappingURL=modal.js.map
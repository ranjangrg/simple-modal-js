class ModalController {
    closeSymbolDim = 1 * this.getDocumentRootFontSizeInPixels();    // 1rem
    modalBtnElem: HTMLElement;
    modalContent: string;
    modalTitle: string;
    modalWrapperElem: HTMLElement;
    modalContentElem: HTMLElement;
    closeSymbol = `<svg xmlns="http://www.w3.org/2000/svg" 
        width="${this.closeSymbolDim}" height="${this.closeSymbolDim}" 
        viewBox="0 0 ${this.closeSymbolDim} ${this.closeSymbolDim}" 
        overflow="visible" stroke="white" stroke-width="5" stroke-linecap="round">
        <line x2="${this.closeSymbolDim}" y2="${this.closeSymbolDim}" />
        <line x1="${this.closeSymbolDim}" y2="${this.closeSymbolDim}" />
    </svg>`;
    constructor(props) {
        this.modalBtnElem = document.getElementById(props.modalBtnElemId);
        this.modalContent = props.modalContent;
        // this.modalTitle = props.modalTitle;
        this.modalTitle = this.modalBtnElem.dataset.modalTitle;
        this.modalWrapperElem = null;
        this.modalContentElem = document.getElementById(this.modalBtnElem.dataset.targetModal);
        this.modalContentElem.classList.add("modal-content");   // assign proper classname
        this.createModalElement();
        this.attachModalContent();
        this.initEventTriggers();
        this.trapFocusWithinModal();
    }
    getDocumentRootFontSizeInPixels() {
        // basic conversion from 1rem to px: Note: no null checks in place currently
        return parseFloat(getComputedStyle(
            document.querySelector('html')).fontSize.replace("px", ""));
    }
    createModalElement() {
        // main modal content container
        let _modalContentContainerElem = document.createElement("div");
        _modalContentContainerElem.setAttribute("id", this.modalContentElem.id + "-modal-container");
        _modalContentContainerElem.setAttribute("class", "modal-container");
        _modalContentContainerElem.setAttribute("role", "dialog");
        _modalContentContainerElem.setAttribute("aria-modal", "true");
        _modalContentContainerElem.setAttribute("aria-expanded", "false");
        _modalContentContainerElem.setAttribute("aria-hidden", "true");

        // close modal btn
        let modalCloseBtnElem = document.createElement("button");
        modalCloseBtnElem.setAttribute("class", "close-modal-btn");
        modalCloseBtnElem.setAttribute("aria-label", "Close this modal/dialog");
        modalCloseBtnElem.innerHTML = this.closeSymbol;

        // close modal btn container
        let modalCloseBtnContainerElem = document.createElement("div");
        modalCloseBtnContainerElem.setAttribute("class", "close-modal-container");
        modalCloseBtnContainerElem.append(modalCloseBtnElem);
        // close modal btn label
        let _modalCloseBtnLabelElem = document.createElement("div");
        _modalCloseBtnLabelElem.setAttribute("class", "close-modal-btn-label");
        _modalCloseBtnLabelElem.setAttribute("aria-hidden", "true");
        _modalCloseBtnLabelElem.textContent = "Close modal";
        modalCloseBtnContainerElem.append(_modalCloseBtnLabelElem);

        // main modal content
        let _modalContentElem = document.createElement("div");
        _modalContentElem.setAttribute("class", "modal-content");
        _modalContentElem.innerHTML = this.modalContent;

        // main modal title; is above main modal container within the background
        let _modalTitleElem = document.createElement("div");
        _modalTitleElem.setAttribute("class", "modal-title");
        _modalTitleElem.textContent = this.modalTitle;

        // main modal content wrapper
        let _modalContentWrapperElem = document.createElement("div");
        _modalContentWrapperElem.setAttribute("class", "modal-content-wrapper");
        _modalContentWrapperElem.append(_modalTitleElem);
        //modalContentWrapperElem.append(_modalContentElem);
        _modalContentWrapperElem.append(this.modalContentElem);

        // add all elements next to the open modal btn in DOM
        _modalContentContainerElem.append(modalCloseBtnContainerElem);
        _modalContentContainerElem.append(_modalContentWrapperElem);
        this.modalWrapperElem = _modalContentContainerElem;
    }
    updateModalContent(newContent: string) {
        this.modalContentElem.innerHTML = newContent;
    }
    updateModalTitle(newContent: string) {
        this.modalTitle = newContent;
    }
    attachModalContent() {
        this.modalBtnElem.parentNode.insertBefore(
            this.modalWrapperElem, this.modalBtnElem.nextSibling);
    }
    initEventTriggers() {
        let mainObj = this;
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
        let closeModalElems = this.modalWrapperElem.getElementsByClassName("close-modal-container");
        for (let idx = 0; idx < closeModalElems.length; ++idx) {
            let elem = closeModalElems.item(idx);
            elem.addEventListener("click", function (e) {
                mainObj.closeModal(mainObj.modalWrapperElem);
            }.bind(mainObj));
        };
    }
    closeModal(modalElem) {
        modalElem.setAttribute("aria-expanded", "false");
        modalElem.setAttribute("aria-hidden", "true");
        modalElem.classList.remove("show");
    }
    openModal() {
        this.modalWrapperElem.setAttribute("aria-expanded", "true");
        this.modalWrapperElem.setAttribute("aria-hidden", "false");
        // this.modalContentElem.setAttribute("tabIndex", "0");
        this.modalWrapperElem.classList.add("show");
    }
    trapFocusWithinModal() {
        const focusableElements = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

        const firstFocusableElement = <HTMLElement>this.modalWrapperElem.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
        const focusableContent = this.modalWrapperElem.querySelectorAll(focusableElements);
        const lastFocusableElement = <HTMLElement>focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

        this.modalWrapperElem.addEventListener('keydown', function (e) {
            let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

            if (!isTabPressed) {
                return;
            }

            if (e.shiftKey) { // if shift key pressed for shift + tab combination
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus(); // add focus for the last focusable element
                    e.preventDefault();
                }
            } else { // if tab key is pressed
                if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                    firstFocusableElement.focus(); // add focus for the first focusable element
                    e.preventDefault();
                }
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let openModalBtns = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("open-modal-btn");
    for (let idx: number = 0; idx < openModalBtns.length; ++idx) {
        let btn: HTMLButtonElement = openModalBtns[idx];
        // not sure how JS garbage-collector handles this controller object.
        // haven't tested extensively on lifetime of this controller object and 
        // modal event handlers like close-modal, open-modal etc.
        var modalController = new ModalController({
            modalBtnElemId: btn.id
        });
    }
});

// END OF FILE 
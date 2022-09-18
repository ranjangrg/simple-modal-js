class ModalController {
    closeSymbolDim = 1 * this.getDocumentRootFontSizeInPixels();    // 1rem
    modalBtnElem: HTMLElement;
    modalContent: string;
    modalTitle: string;
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
        this.modalTitle = props.modalTitle;
        this.modalContentElem = null;
        this.createModalElement();
        this.attachModalContent();
        this.initEventTriggers();
        this.trapFocusWithinModal();
    }
    getDocumentRootFontSizeInPixels() {
        // basic conversion from 1rem to px: Note: no null checks in place currently
        return parseFloat(getComputedStyle(document.querySelector('html')).fontSize.replace("px",""));
    }
    createModalElement() {
        // main modal content container
        let modalContentContainerElem = document.createElement("div");
        modalContentContainerElem.setAttribute("id", this.modalBtnElem.id + "-modal-container");
        modalContentContainerElem.setAttribute("class", "modal-container");
        modalContentContainerElem.setAttribute("role", "dialog");
        modalContentContainerElem.setAttribute("aria-modal", "true");
        modalContentContainerElem.setAttribute("aria-expanded", "false");
        modalContentContainerElem.setAttribute("aria-hidden", "true");

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
        let modalCloseBtnLabelElem = document.createElement("div");
        modalCloseBtnLabelElem.setAttribute("class", "close-modal-btn-label");
        modalCloseBtnLabelElem.setAttribute("aria-hidden", "true");
        modalCloseBtnLabelElem.textContent = "Close modal";
        modalCloseBtnContainerElem.append(modalCloseBtnLabelElem);

        // main modal content
        let modalContentElem = document.createElement("div");
        modalContentElem.setAttribute("class", "modal-content");
        modalContentElem.innerHTML = this.modalContent;

        // main modal title
        let modalTitleElem = document.createElement("div");
        modalTitleElem.setAttribute("class", "modal-title");
        modalTitleElem.textContent = this.modalTitle;

        // main modal content wrapper
        let modalContentWrapperElem = document.createElement("div");
        modalContentWrapperElem.setAttribute("class", "modal-content-wrapper");
        modalContentWrapperElem.append(modalTitleElem);
        modalContentWrapperElem.append(modalContentElem);

        // add all elements next to the open modal btn in DOM
        modalContentContainerElem.append(modalCloseBtnContainerElem);
        modalContentContainerElem.append(modalContentWrapperElem);
        this.modalContentElem = modalContentContainerElem;
    }
    attachModalContent() {
        this.modalBtnElem.parentNode.insertBefore(
            this.modalContentElem, this.modalBtnElem.nextSibling);
    }
    initEventTriggers() {
        let mainObj = this;
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
        let closeModalElems = this.modalContentElem.getElementsByClassName("close-modal-container");
        for (let idx = 0; idx < closeModalElems.length; ++idx) {
            let elem = closeModalElems.item(idx);
            elem.addEventListener("click", function (e) {
                mainObj.closeModal(mainObj.modalContentElem);
            }.bind(mainObj));
        };
    }
    closeModal(modalElem) {
        modalElem.setAttribute("aria-expanded", "false");
        modalElem.setAttribute("aria-hidden", "true");
        modalElem.classList.remove("show");
    }
    openModal() {
        this.modalContentElem.setAttribute("aria-expanded", "true");
        this.modalContentElem.setAttribute("aria-hidden", "false");
        // this.modalContentElem.setAttribute("tabIndex", "0");
        this.modalContentElem.classList.add("show");
    }
    trapFocusWithinModal() {
        const focusableElements = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

        const firstFocusableElement = <HTMLElement>this.modalContentElem.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
        const focusableContent = this.modalContentElem.querySelectorAll(focusableElements);
        const lastFocusableElement = <HTMLElement>focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

        this.modalContentElem.addEventListener('keydown', function (e) {
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

// END OF FILE 
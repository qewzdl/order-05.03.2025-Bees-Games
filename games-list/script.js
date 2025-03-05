//#region Loading
window.onload = () => {
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
};
//#endregion

//#region Background Container Height Adjustment
function adjustContainerHeight() {
    const bgContainer = document.getElementById('bg-container');
    const img = new Image();
    img.src = './images/main-bg.png';
    
    img.onload = function() {
        const imageAspectRatio = img.height / img.width;
        const currentWidth = bgContainer.offsetWidth;
        const calculatedHeight = currentWidth * imageAspectRatio;
        bgContainer.style.height = `${calculatedHeight}px`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    adjustContainerHeight();
    setAspectRatio();

    window.addEventListener('resize', () => {
        adjustContainerHeight();
        setAspectRatio();
    });

    const objects = document.querySelectorAll('.object');
    objects.forEach(obj => {
        obj.addEventListener('click', () => {
            const objNumber = obj.id.replace('obj', '');
            toggleModal(objNumber);
            setTimeout(setAspectRatio, 0);
        });
    });
});
//#endregion

//#region Modals Ratio
function setAspectRatio() {
    let modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        let height = modal.clientHeight;
        modal.style.width = (height * (16 / 9)) + 'px';
    });
}
//#endregion

//#region Toggle Modals
function toggleModal(objNumber) {
    const modal = document.getElementById(`modal${objNumber}`);
    modal.classList.toggle('disabled');
}
//#endregion
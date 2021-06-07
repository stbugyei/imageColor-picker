/*
==============================================================
declaring global variables
==============================================================
*/
let colorShade
const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    preview = document.querySelector('.preview'),
    tooltip = document.querySelector('.tooltip'),
    dropZone = document.querySelector(".drop-zone"),
    filename = document.querySelector('.file-name'),
    canvasText = document.querySelector('.bg-text'),
    tintCanvas = document.querySelector('.text-canvas'),
    dropIcon = document.querySelector('.drop-zone__icon'),
    hoveredColor = document.querySelector('.hovered-color'),
    dropIcon1 = document.querySelector('.drop-zone__icon1'),
    hoveredColor1 = document.querySelector('.hovered-color1'),
    selectedColor = document.querySelector('.selected-color'),
    filewrapper = document.querySelector('.file-name__wrapper'),
    hoveredCode = document.querySelector('.hovered-color__codeitem'),
    selectedCode = document.querySelector('.selected-color__codeitem'),
    hoveredCode1 = document.querySelector('.hovered-color__codeitem1');
var resQuery = [window.matchMedia("(max-width: 540px)"), window.matchMedia("(min-width: 677px)"), window.matchMedia("(min-width: 768px)")]

/*
==============================================================
creating the image object
==============================================================
*/
const img = new Image();
img.crossOrigin = 'anonymous';
//img.src = 'https://images.pexels.com/photos/1653634/pexels-photo-1653634.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

/*
==============================================================
uploadImage from input, function
==============================================================
*/
function uploadImage() {
    const regex = /image.*/;
    let currentImg = document.querySelector('input[type=file]').files[0];
    let myReader = new FileReader();
    myReader.addEventListener("load", function () {
        img.src = myReader.result;
    }, false);

    if (currentImg.type.match(regex)) {
        myReader.readAsDataURL(currentImg);
        showFileContent(currentImg);
        showDropIcon();
    } else {
        showErrorFile();
        hideDropIcon();
    }
}

/*
==============================================================
display file name with animation: event & function
==============================================================
*/
function showFileContent(file) {
    filewrapper.style.display = 'block'
    filename.innerHTML = file.name
    filewrapper.style.color = 'green'
    filewrapper.classList.add('animation');
}


/*
==============================================================
show error msg when image file type is not supported, function
==============================================================
*/
function showErrorFile() {
    filewrapper.style.display = 'block'
    filename.innerHTML = 'File type not supported'
    filewrapper.style.color = 'red'
}

function showErrorFileCors() {
    filewrapper.style.display = 'block'
    filename.innerHTML = `File type not supported</br>
    <small>Make sure to Open the Image URL and drop </br> Or Download to Device and browse</small>`
    filewrapper.style.color = 'red'
}

/*
==============================================================
showDropIcon when image is successfully uploaded, function
==============================================================
*/
function showDropIcon() {
    dropIcon1.style.display = 'block';
    dropIcon.style.display = 'none';
    tintCanvas.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
}

/*
==============================================================
hideDropIcon when image file type is not supported, function
==============================================================
*/
function hideDropIcon() {
    dropIcon1.style.display = 'none';
    dropIcon.style.display = 'block';
    dropIcon.style.color = 'red';
    img.src = 'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
}

function animateFileOnLoad() {
    filewrapper.classList.remove('animation');
    canvasText.style.display = 'none'
}

img.addEventListener("load", animateFileOnLoad, false);


/*
==============================================================
Prevent image from being opened when dropped
==============================================================
*/
function dragOverHandler(e) {
    e.stopPropagation();
    e.preventDefault();
}

/*
==============================================================
drop image from a URL/storage, function
==============================================================
*/
function dropImageFromFile(e) {
    e.stopPropagation();
    e.preventDefault();
    const regex = /image.*/;
    const imageUrl = e.dataTransfer.getData('text');
    const files = e.dataTransfer.files;

    //== drop image from a URL ==//
    if (imageUrl) {
        if (imageUrl.match(regex) !== null) {
            img.src = imageUrl
            filewrapper.style.display = 'block'
            filewrapper.style.color = 'green'
            filename.innerHTML = imageUrl.slice(15, 40)
            showDropIcon();
        } else {
            //showErrorFile();
            showErrorFileCors();
            hideDropIcon();
        }

        //== drop image from device or storage ==//
    } else if (files) {
        for (let i = 0, file; file = files[i]; i++) {
            let reader = new FileReader();
            reader.addEventListener("load", function (targetFile) {
                img.src = targetFile.target.result;
            }, false);

            if (file.type.match(regex)) {
                reader.readAsDataURL(file);
                showFileContent(file);
                showDropIcon();

            } else {
                showErrorFile();
                hideDropIcon();
            }
        }
    }
}

/*
==============================================================
paint the image to the canvas on load
==============================================================
*/
//img.onload = function () {

// let width = canvas.width;
// let nwidth = img.naturalWidth;
// let nheight = img.naturalHeight;
// let aspect = nwidth / nheight;;
// let height = width / aspect
// canvas.height = height;
// context.drawImage(img, 0, 0, width, height);
// img.style.display = 'none';
//};

img.onload = drawImageInCanvas

function drawImageInCanvas() {
    let horizontalRatio = canvas.width / img.width;
    let verticalRatio = canvas.height / img.height;
    let ratio = Math.min(horizontalRatio, verticalRatio);
    let centerX = (canvas.width - img.width * ratio) / 2;
    let centerY = (canvas.height - img.height * ratio) / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, img.width, img.height, centerX, centerY, img.width * ratio, img.height * ratio);
    img.style.display = 'none';
}

/*
==============================================================
pick color function
==============================================================
*/
function pickColor(event, destination, code) {
    const x = event.layerX;
    const y = event.layerY;
    const pixel = context.getImageData(x, y, 1, 1);
    const data = pixel.data;
    //const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    const hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);

    destination.style.background = hex;
    colorShade = hex

    if (code === hoveredCode) {
        code.textContent = hex
    } else if (code === hoveredCode1) {
        code.textContent = rgbToHslConverter(rgb);
    } else if (code === selectedCode) {
        code.textContent = rgb
    }
    else if (code === 'undefined') {
        code.textContent = ""
    }

    return { hex, rgb };
}

/*
==============================================================
convert rgb to hex
==============================================================
*/
function rgbToHexConverter(rgb) {
    const regex = /[\(|\)|r|g|b| ]/g
    let rgbString = rgb.replace(regex, '')
    let rgbArr = new Array();
    rgbArr = rgbString.split(",");
    const hex = "#" + ((1 << 24) + ((+rgbArr[0]) << 16) + ((+rgbArr[1]) << 8) + (+rgbArr[2])).toString(16).slice(1);
    return hex
}

/*
==============================================================
convert rgb to hsl
==============================================================
*/

function rgbToHslConverter(rgb) {
    const regex = /[\(|\)|r|g|b| ]/g
    let rgbString = rgb.replace(regex, '')
    let rgbArr = new Array();
    rgbArr = rgbString.split(",");
    r = (+rgbArr[0])
    g = (+rgbArr[1])
    b = (+rgbArr[2])

    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let delta = max - min;
    let h;

    if (delta === 0) h = 0;
    else if (max === r) h = ((((g - b) / delta) % 6) + 6) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else if (max === b) h = (r - g) / delta + 4;

    let l = ((min + max) / 2);
    let s = (delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)));
    const hsl = `hsl(${Math.round(h * 60)}, ${Math.round((s * 100))}, ${Math.round((l * 100))})`;

    return hsl
}

/*
==============================================================
tool tip background color function
==============================================================
*/
const toolTipBgColor = new (function () {
    tooltip.setAttribute('hidden', '');

    this.follow = function (event) {
        tooltip.style.left = event.clientX + 15 + 'px';
        resQuery[0].matches ? tooltip.style.top = event.clientY + 440 + 'px' : tooltip.style.top = event.clientY + 5 + 'px';
    };

    this.show = function () {
        tooltip.removeAttribute('hidden');
    };

    this.hide = function () {
        tooltip.setAttribute('hidden', '');
    };
})();

/*
==============================================================
event listeners to activate the pickColor and toolTipBgColor
==============================================================
*/
canvas.onmouseover = toolTipBgColor.show;
canvas.onmousemove = toolTipBgColor.follow;
canvas.onmouseout = toolTipBgColor.hide;

canvas.addEventListener('mousemove', function (event) {
    pickColor(event, tooltip);
});

canvas.addEventListener('mousemove', function (event) {
    pickColor(event, preview);
});

canvas.addEventListener('click', function (event) {
    pickColor(event, hoveredColor, hoveredCode);
});

canvas.addEventListener('click', function (event) {
    pickColor(event, hoveredColor1, hoveredCode1);
});

canvas.addEventListener('click', function (event) {
    pickColor(event, selectedColor, selectedCode);
    generateShadeColorDiv(colorShade)
});


/*
==============================================================
copy color rgb and hex code, function and events
==============================================================
*/
function copyColorCode(cls) {
    const textEl = document.createElement('textarea')
    textEl.value = cls.innerHTML
    textEl.style.position = 'absolute';
    textEl.style.left = '-9999px';
    textEl.setAttribute('readonly', '');
    document.body.appendChild(textEl)
    textEl.select();
    document.execCommand('copy');
    document.body.removeChild(textEl);
}


/*
==============================================================
copy Rgb color: events
==============================================================
*/
const selectedColorWrapper = document.querySelector('.select-color__wrapper');
const selectedNotice = document.querySelector('.selected-notification');
const myRgbColor = document.querySelector('.rgb-color');
const copyRgb = document.querySelector('.selected-color__copy');
const closeSelNotice = document.querySelector('.notice-icon');
let timeOut = null

copyRgb.addEventListener('click', function () {
    copyColorCode(selectedCode)
    selectedNotice.classList.add('displayNotice');
    myRgbColor.textContent = selectedCode.textContent
    selectedColorWrapper.style.backgroundColor = selectedCode.textContent
    timeOut = setTimeout(() => {
        selectedNotice.classList.remove('displayNotice');
        selectedColorWrapper.style.backgroundColor = 'initial'
    }, 4000);
});

//== remove Rgb color notification ==//
closeSelNotice.addEventListener('click', function () {
    selectedNotice.classList.remove('displayNotice');
    selectedColorWrapper.style.backgroundColor = 'initial'
    clearInterval(timeOut);
});

/*
==============================================================
copy Hex color: events
==============================================================
*/
const hoveredNotice = document.querySelector('.hovered-notification');
const closeHovNotice = document.querySelector('.notice-icon1');
const copyHex = document.querySelector('.hovered-color__copy');
const myHexColor = document.querySelector('.hex-color');

let timeOut1 = null

copyHex.addEventListener('click', function () {
    copyColorCode(hoveredCode)
    hoveredNotice.classList.add('displayNotice');
    myHexColor.textContent = rgbToHexConverter(selectedCode.textContent)
    selectedColorWrapper.style.backgroundColor = selectedCode.textContent
    timeOut1 = setTimeout(() => {
        hoveredNotice.classList.remove('displayNotice');
        selectedColorWrapper.style.backgroundColor = 'initial'
    }, 4000);
});

//== remove Hex color notification ==//
closeHovNotice.addEventListener('click', function () {
    hoveredNotice.classList.remove('displayNotice');
    selectedColorWrapper.style.backgroundColor = 'initial'
    clearInterval(timeOut1);
});

/*
==============================================================
copy Hsl color: events
==============================================================
*/
const closeHovNotice1 = document.querySelector('.notice-icon2');
const copyHsl = document.querySelector('.hovered-color__copy1');
const myHslColor = document.querySelector('.hsl-color');
const hoveredNotice1 = document.querySelector('.hovered-notification1');
let timeOut2 = null

copyHsl.addEventListener('click', function () {
    copyColorCode(hoveredCode1)
    hoveredNotice1.classList.add('displayNotice');
    myHslColor.textContent = rgbToHslConverter(selectedCode.textContent)
    selectedColorWrapper.style.backgroundColor = selectedCode.textContent
    timeOut2 = setTimeout(() => {
        hoveredNotice1.classList.remove('displayNotice');
        selectedColorWrapper.style.backgroundColor = 'initial'
    }, 4000);
});

//== remove Hsl color notification ==//
closeHovNotice1.addEventListener('click', function () {
    hoveredNotice1.classList.remove('displayNotice');
    selectedColorWrapper.style.backgroundColor = 'initial'
    clearInterval(timeOut2);
});

/*
==============================================================
redraw the image when canvas resize
==============================================================
*/
// const rect = canvas.parentNode.getBoundingClientRect();
// canvas.width = rect.width;
// canvas.height = rect.height;
canvas.width = canvas.parentNode.offsetWidth
window.onresize = function () {
    canvas.width = canvas.parentNode.offsetWidth
    drawImageInCanvas();
}

/*
================================================================
stretch the canvas width to fit the parent div for mobile devices
================================================================
*/
var timeoutReload = 0
timeoutReload > 3 ? clearInterval(timeoutReload) : timeoutReload;

for (let i = 0; i < resQuery.length; i++) {
    //@ every instance of width change.
    resQuery[i].addEventListener("change", (e) => {
        if (e.matches) {
            canvas.width = canvas.parentNode.offsetWidth
            timeoutReload = setInterval(() => {
                window.location.reload();
            }, 100);
        } else {
            canvas.width = canvas.parentNode.offsetWidth
        }
    })

}


/*
==============================================================
get tints or shades of selectecd color
==============================================================
*/
const tintAndShadesW = document.querySelector('.tint-shade__wrapper');
const tintColorWrapper = document.querySelector('.tint-color__wrapper');
const shadeColorWrapper = document.querySelector('.shade-color__wrapper');

function modifyColor(colorShade, value) {
    return '#' + colorShade.replace(/^#/, '').replace(/../g, colorShade => ('0' + Math.min(255, Math.max(0, parseInt(colorShade, 16) + value)).toString(16)).substr(-2));
}

//== generate divs with modifyColor function ==//

function generateShadeColorDiv(colorShade) {
    tintColorWrapper.innerHTML = ''
    shadeColorWrapper.innerHTML = ''
    if (colorShade) {
        for (let i = 0; i <= 100; i++) {
            if (i % 10 === 0) {
                let colorTints = `<div class="tint-color" style="background-color:${modifyColor(colorShade, i)};"></div>`
                let colorShades = `<div class="tint-color" style="background-color:${modifyColor(colorShade, -i)};"></div>`
                tintColorWrapper.innerHTML += colorTints;
                shadeColorWrapper.innerHTML += colorShades;
            }
        }

        let tintBackgroundColor = Array.from(tintAndShadesW.children[0].childNodes);
        let shadesBackgroundColor = Array.from(tintAndShadesW.children[1].childNodes);
        let tintAndShades = tintBackgroundColor.concat(shadesBackgroundColor);

        tintAndShades.forEach(element => {
            element.addEventListener('click', function () {
                let currentBgColor = element.style.backgroundColor
                selectedCode.textContent = currentBgColor
                hoveredColor.style.backgroundColor = currentBgColor
                selectedColor.style.backgroundColor = currentBgColor
                hoveredCode.textContent = rgbToHexConverter(currentBgColor)
                hoveredCode1.textContent = rgbToHslConverter(currentBgColor)
                hoveredColor1.style.backgroundColor = currentBgColor
            });
        });

        tintAndShades.forEach(element => {
            element.addEventListener('mouseover', function () {
                let currentBgColor = element.style.backgroundColor
                preview.style.backgroundColor = currentBgColor
            });
        });
    }
}
(async function () {

    if (undefined === window._js_binding) {
        window._js_binding = {
            openUrl: (url) => {
                window.open(url)
            },
            isIos: () => {
                return /iPhone|iPad|iPod/i.test(navigator.userAgent)
            },
            isAndroid: () => {
                return /Android/i.test(navigator.userAgent)
            },
            isMobileDevice: () => {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            }
        }
    }

    const bodyElement = document.getElementsByTagName("body")[0]

    function createCanvas() {
        bodyElement.className = "canvas-panel"
        const canvasContainer = document.createElement("div")
        canvasContainer.className = "canvas-container"
        const canvasElement = document.createElement("canvas")
        canvasContainer.appendChild(canvasElement)
        bodyElement.appendChild(canvasContainer)
        return canvasElement
    }

    const headElement = document.getElementsByTagName("head")[0]
    const headTitle = headElement.getElementsByTagName("title")[0]

    function setCanvasOrientation(orientation, canvas) {
        const linkElement = document.createElement("link")
        linkElement.id = "CanvasOrientation"
        linkElement.type = "text/css"
        linkElement.rel = "stylesheet"
        switch (orientation) {
            case "portrait":// 竖屏
                canvas.height = 1920
                canvas.width = 1080
                linkElement.href = "css/portraiture.css"
                headElement.appendChild(linkElement)
                break;
            case "landscape":// 横屏
                canvas.width = 1920
                canvas.height = 1080
                linkElement.href = "css/landscape.css"
                headElement.appendChild(linkElement)
                break;
        }
    }

    const linkElement = document.createElement("link")
    linkElement.type = "text/css"
    linkElement.rel = "stylesheet"
    linkElement.href = "css/loading.css"
    headElement.appendChild(linkElement)

    const loading = document.createElement("div")
    loading.className = "loading"
    const load = document.createElement("div")
    load.className = "load"
    const text = document.createElement("div")
    text.textContent = "资源加载中,请稍后..."
    text.className = "text"
    loading.appendChild(load)
    loading.appendChild(text)
    bodyElement.appendChild(loading)

    function loadResources(url, split) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = url
            img.onerror = function () {
                reject("资源加载失败!")
            }
            img.onload = function () {
                if (split) {
                    const xhr = new XMLHttpRequest()
                    xhr.responseType = "json"
                    xhr.withCredentials = true
                    xhr.overrideMimeType('application/json')
                    xhr.onload = async () => {
                        if (xhr.status === 200) {
                            const resources = {}
                            const picture = new PictureUtil(this)
                            const array = xhr.response.frames
                            for (let i = 0; i < array.length; i++) {
                                const image = await picture.cutPicture(array[i])
                                resources[image.alt] = image
                            }
                            resolve(resources)
                        } else if (xhr.status === 404) {
                            reject("图片分割失败")
                        }
                    }
                    xhr.open("GET", this.src.substr(0, this.src.lastIndexOf('.')) + ".json")
                    xhr.send()
                } else {
                    resolve(this)
                }
            }
        })
    }

    const canvasElement = createCanvas()
    setCanvasOrientation("portrait", canvasElement)
    const canvasContext = canvasElement.getContext('2d')

    const loadAudio = (url) => {
        return new Promise((resolve, reject) => {
            const audio = document.createElement("audio")
            audio.controls = true
            audio.className = "audio-controls"
            audio.onerror = () => {
                reject("加载失败!")
            }

            const source2 = document.createElement("source")
            source2.src = url + ".ogg"
            source2.type = "audio/ogg"
            audio.appendChild(source2)

            const source = document.createElement("source")
            source.src = url + ".mp3"
            source.type = "audio/mpeg"
            audio.appendChild(source)

            const source3 = document.createElement("source")
            source3.src = url + ".acc"
            source3.type = "audio/acc"
            audio.appendChild(source3)
            resolve(audio)
        })
    }

    const resources = await gameStart(canvasElement, canvasContext, loadResources, loadAudio)
    const favicon = resources["favicon.ico"]
    headTitle.innerHTML = favicon.alt
    let iconLink = document.getElementById("faviconIco")
    if (null === iconLink || undefined === iconLink) {
        iconLink = document.createElement("link")
        iconLink.rel = "shortcut icon"
        iconLink.type = "image/x-icon"
        headElement.appendChild(iconLink)
    }
    iconLink.href = favicon.src
    bodyElement.removeChild(loading)
})()
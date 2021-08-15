// to enable plugins
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)



// setting options to get image in required width and height
FilePond.setOptions({
    stylePanelAspectRatio: 200 / 280,
    imageResizeTargetWidth: 280,
    imageResizeTargetHeight: 200,
})



// to parse the image data in the document
FilePond.parse(document.body)
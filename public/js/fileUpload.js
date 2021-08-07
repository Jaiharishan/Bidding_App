
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 200 / 280,
    imageResizeTargetWidth: 280,
    imageResizeTargetHeight: 200,
}
    
)

FilePond.parse(document.body)
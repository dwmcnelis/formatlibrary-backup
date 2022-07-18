
import React, { useState } from 'react'

const ImageCreator = () => {
    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [folder, setFolder] = useState(null)

    //RESET
    const reset = async () => {
        setImage(null)
        setFileName(null)
        setFolder(null)
        document.getElementById('image').value = null
        document.getElementById('file-name').value = null
        document.getElementById('folder').value = null
    }

    console.log('image', image)
    console.log('fileName', fileName)
    console.log('folder', folder)

    //CREATE IMAGE
    const createImage = async () => {
        if (!image) return alert('Please upload an Image file.')
        if (!fileName) return alert('Please specify a File Name.')
        if (!folder) return alert('Please select a Folder.')
        try {
            const buffer = image.replace(/^data:image\/png;base64,/, '')
            fs.writeFileSync(`./public/images/${folder}/${fileName}`, buffer, 'base64')
            alert(`Success! New Image: /images/${folder}/${fileName}`)
            return reset()
        } catch (err) {
            console.log(err)
        }
    }

    // READ IMAGE
    const readImage = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => setImage(reader.result)
    }

    return (
        <div className="admin-portal">
            <label>
                Folder:
                <select
                    id="folder"
                    className="login"
                    onChange={(e) => setFolder(e.target.value)}
                >
                    <option value={null}></option>
                    <option value="Artworks">Artworks</option>
                    <option value="Brackets">Brackets</option>
                    <option value="Cards">Cards</option>
                    <option value="Emojis">Emojis</option>
                    <option value="Logos">Logos</option>
                    <option value="PFPs">PFPs</option>
                </select>
            </label>
            <label>Image:
                <input
                    id="bracket"
                    className="login"
                    type="file"
                    accept="image/*"
                    onChange={(e) => readImage(e.target.files[0])}
                />
            </label>
            <label>File Name:
                <input
                    id="file-name"
                    className="login"
                    type="text"
                    onChange={(e) => setFileName(e.target.value)}
                />
            </label>
            <a
                className="admin-button"
                type="submit"
                onClick={() => createImage()}
            >
                Submit
            </a>
        </div>
    )
}

export default ImageCreator
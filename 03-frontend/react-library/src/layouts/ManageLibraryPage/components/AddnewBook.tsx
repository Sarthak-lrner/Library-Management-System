import { useState } from 'react';
import AddBookRequest from '../../../models/AddBookRequest';
import { useAuth } from '../../../Auth/AuthProvider';
import api from '../../../Api/apiClient';

export const AddNewBook = () => {
    const {isLoggedIn } = useAuth();

    // Form fields
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // UI feedback
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    async function base64ConversionForImages(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.onerror = error => console.error('Image conversion error:', error);
        }
    }

    async function submitNewBook() {
        if (
            !isLoggedIn ||
            title === '' || author === '' || description === '' ||
            category === 'Category' || copies < 0
        ) {
            setDisplayWarning(true);
            setDisplaySuccess(false);
            return;
        }

        const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
        book.img = selectedImage ?? undefined;


        try {
            await api.post('/api/admin/secure/add/book', book);
            setTitle('');
            setAuthor('');
            setDescription('');
            setCopies(0);
            setCategory('Category');
            setSelectedImage(null);
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } catch (error) {
            console.error("Add book failed:", error);
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }
            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out correctly
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new book
                </div>
                <div className='card-body'>
                    <form>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type="text" className='form-control' value={title}
                                    onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Author</label>
                                <input type="text" className='form-control' value={author}
                                    onChange={e => setAuthor(e.target.value)} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                    data-bs-toggle='dropdown'>
                                    {category}
                                </button>
                                <ul className='dropdown-menu'>
                                    <li><a className='dropdown-item' onClick={() => categoryField('FE')}>Front End</a></li>
                                    <li><a className='dropdown-item' onClick={() => categoryField('BE')}>Back End</a></li>
                                    <li><a className='dropdown-item' onClick={() => categoryField('Data')}>Data</a></li>
                                    <li><a className='dropdown-item' onClick={() => categoryField('DevOps')}>DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' rows={3} value={description}
                                onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type='number' className='form-control' value={copies}
                                onChange={e => setCopies(Number(e.target.value))} />
                        </div>
                        <input type='file' onChange={base64ConversionForImages} className='mb-3' />
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

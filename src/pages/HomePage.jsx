import React, { useState } from 'react'
import { useFirebase, useFirebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
// import MultiSelect from "react-multi-select-component";
import MultiSelect from "@khanacademy/react-multi-select";
import { useSelector } from 'react-redux'
import defaultImage from '../assets/images/default_image.png';
import loadingImg from '../assets/images/preloader.gif';

const HomePage = () => {
    const [product, setProduct] = useState({
        id: '',
        Name: '',
        allergies: '',
        category: '',
        description: '',
        favorited: '0',
        healthProblem: '',
        imageUrl: '',
        ingredients: '',
        price: '0',
        rate: '0',
        rate_num: '0',
        stock: '0',
    });
    const [file, setFile] = useState(null);
    const [editIndex, setEditIndex] = useState(-1);
    const [keyword, setKeyword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [healthProblem, setHealthProblem] = useState([])
    const firebase = useFirebase()
    useFirebaseConnect([
        'product', 'category', 'healthProblem',
    ])
    const categories = useSelector(state => state.firebase.ordered.category)
    const initProducts = useSelector(state => state.firebase.ordered.product)
    const healthProblems = useSelector(state => state.firebase.ordered.healthProblem)
    const products = !!initProducts ?
        initProducts.filter(pdt => !keyword || pdt.value.Name.toLowerCase().includes(keyword)) :
        [];

    // console.log(products)
    // console.log('[category]', categories)
    let options = healthProblems ? healthProblems.map(hp => {return {label: hp.value.name, value: hp.value.name}; }) : [];

    const addProduct = (filepath = '') => {
        console.log(product);
        // validate
        if (!product.Name || !product.category || !product.healthProblem || !product.ingredients || !product.allergies ||
            !product.description || !product.stock || !product.price) {
            alert('Please fill all fields!');
            setProcessing(false);
            return false;
        }
        const params = {};
        for (let key in product) {
            params[key] = product[key];
        }
        params['id'] = (new Date().getTime()).toString();
        if (!!filepath) params['imageUrl'] = filepath;
        console.log('index', editIndex);
        if (editIndex === -1) {
            firebase.push('product', params)
                .then(response => {
                    alert('You have added a product!');
                    initProduct()
                })
                .catch(err => {
                    console.error(err)
                })
        } else {
            // console.log(products[editIndex])
            firebase.ref(`product/${products[editIndex].key}`).update(params)
                .then(response => {
                    alert('Product has been updated successfully!');
                    initProduct();
                    setEditIndex(-1);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }
    const initProduct = () => {
        setProduct({
            id: '',
            Name: '',
            allergies: '',
            category: '',
            description: '',
            favorited: '0',
            healthProblem: '',
            imageUrl: '',
            ingredients: '',
            price: '0',
            rate: '0',
            rate_num: '0',
            stock: '0',
        });
        setProcessing(false);
    }
    const handleOnChange = (e) => {
        setProduct({ ...product, [e.currentTarget.name]: e.currentTarget.value })
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = function (ee) {
            setProduct({ ...product, imageUrl: ee.target.result });
        }
        reader.readAsDataURL(e.target.files[0]);
    }
    const uploadFile = () => {
        const path = 'images';
        const databasePath = 'images';
        return firebase.uploadFile(path, file, databasePath)
    }
    const handleSubmit = () => {
        setProcessing(true);
        if (file) {
            uploadFile().then(snap => {
                addProduct(snap.downloadURL);
            })
                .catch(err => console.log(err));
        } else {
            addProduct();
        }
    }
    const editProduct = (i) => {
        setProduct(products[i].value);
        setEditIndex(i);
    }
    const deleteProduct = (i) => {
        firebase.ref(`product/${products[i].key}`).remove()
            .then(() => {
                alert('You deleted a product');
                initProduct();
            })
            .catch(err => console.error(err))

    }
    const multiSelectChanged = (value) => {
        console.log(value)
        setProduct({...product, healthProblem: value.join(',')})
    }
    const getSelectedHP = (hp) => {
        let arr = hp ? hp.split(',') : [];
        let filtered = [];
        for (let item of arr) {
            if (!!item) filtered.push(item);
        }
        return filtered;
    }
    return (
        <div className="App" >
            {
                processing && <div className="fixed w-full h-full top-0 left-0 right-0 bottom-0 loading-con"
                    style={{ background: '#b7b7b799' }}>
                    <img className="loading-img" src={loadingImg} alt="Health Image" />
                </div>
            }
            <div className="flex flex-wrap px-12 pt-24">
                <div className="w-1/3">
                    <div className="overflow-hidden" style={{ maxWidth: '250px', maxHeight: '250px', overFlow: 'hidden' }}>
                        <img src={product.imageUrl ? product.imageUrl : defaultImage}
                            style={{ width: '100%', height: '100%' }} alt=""/>
                    </div>
                    <input type="file" name="photo" onChange={handleFileChange} className="mt-4" />
                </div>
                <div className="w-2/3 flex flex-wrap">
                    <div className="w-1/2">
                        <div className="form-group px-3 py-2">
                            <label>Name</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Name"
                                name="Name"
                                value={product.Name}
                                onChange={handleOnChange} />
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Category</label>
                            <select className="block w-full border border-black rounded-sm"
                                name="category" value={product.category} onChange={handleOnChange}>
                                {
                                    categories && categories.map((category, i) =>
                                        <option value={category.value.name} key={i} checked={product.category === category.value.name}>{category.value.name}</option>)

                                }
                            </select>
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Health Problem</label>
                            <MultiSelect
                                options={options}
                                selected={getSelectedHP(product.healthProblem)}
                                onSelectedChanged={multiSelectChanged}
                            />
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Ingredients</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Ingredients"
                                name="ingredients"
                                value={product.ingredients}
                                onChange={handleOnChange} />
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="form-group px-3 py-2">
                            <label>Allergies</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Allergles"
                                name="allergies"
                                value={product.allergies}
                                onChange={handleOnChange} />
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Description</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Description"
                                name="description"
                                value={product.description || ''}
                                onChange={handleOnChange} />
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Stock</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Stock"
                                name="stock"
                                value={product.stock}
                                onChange={handleOnChange} />
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Price</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Price"
                                name="price"
                                value={product.price}
                                onChange={handleOnChange} />
                        </div>
                    </div>
                    <div className="w-full flex justify-center mt-6">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleSubmit} disabled={processing}>
                            {editIndex > -1 ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mx-12 mt-20 mb-20 overflow-auto">
                <div className="flex justify-content-center">
                    <input className="px-3 py-2 border border-gray-600 rounded-md mx-auto mb-6 focus:outline-none"
                        style={{ minWidth: '400px' }}
                        placeholder="Search..." value={keyword} onChange={e => setKeyword(e.target.value)} />
                </div>
                {
                    (!isLoaded(products) || isEmpty(products)) &&
                    <div><h3 className="text-center">Loading Data...</h3></div>
                }
                {
                    isLoaded(products) && !isEmpty(products) && products &&
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>healthProblem</th>
                                <th>Category</th>
                                <th>Ingredients</th>
                                <th>Allergies</th>
                                <th>Description</th>
                                <th>Stock</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products && products.map((product, i) => (
                                    product &&
                                    <tr key={i}>
                                        <td>{product.value.Name}</td>
                                        <td>{product.value.healthProblem}</td>
                                        <td>{product.value.category}</td>
                                        <td>{product.value.ingredients}</td>
                                        <td>{product.value.allergies}</td>
                                        <td>{product.value.description}</td>
                                        <td>{product.value.stock}</td>
                                        <td>{product.value.price}</td>
                                        <td>
                                            <button className="mr-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0 px-4 my-1 border border-blue-500 hover:border-transparent rounded"
                                                onClick={() => editProduct(i)}>Edit</button>
                                            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0 px-4 my-1 border border-blue-500 hover:border-transparent rounded"
                                                onClick={() => deleteProduct(i)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}
export default HomePage

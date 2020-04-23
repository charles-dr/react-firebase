import React, { useState } from 'react'
import { useFirebase } from 'react-redux-firebase'

interface Product {
    Name: string,
    allergies: string,
    category: string,
    description: string,
    favorited: string,
    healthProblem: string,
    imageUrl: string,
    ingredients: string,
    price: number,
    rate: number,
    rate_num: number,
    stock: number,
}


const HomePage: React.FC = () => {
    const [product, setProduct] = useState({
        Name: '',
        allergies: '',
        category: '',
        description: '',
        favorited: '',
        healthProblem: '',
        imageUrl: '',
        ingredients: '',
        price: 0,
        rate: 0,
        rate_num: 0,
        stock: 0,
    });

    const firebase = useFirebase()
    const addProduct = () => {
        console.log(product)
        return firebase.push('product', product)
        .then(response => {
            console.log(response)
        })
        .catch (err => {
            console.error(err)
        })
    }

    const handleOnChange = (e:React.FormEvent<HTMLInputElement>) => {
        setProduct({...product, [e.currentTarget.name]: e.currentTarget.value})
    }

    return (
        <div className="App" >
            <div className="flex flex-wrap px-12 pt-24">
                <div className="w-1/3">
                    <div className="w-full max-w-250px max-h-250px mx-auto border solid border-gray-500 pt-full">

                    </div>
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
                            <input className="block w-full border border-black rounded-sm" placeholder="Category"
                                name="category"
                                value={product.category}
                                onChange={handleOnChange}/>
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Health Problem</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Health Problem"
                                name="healthProblem"
                                value={product.healthProblem}
                                onChange={handleOnChange}/>
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Ingredients</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Ingredients"
                                name="ingredients"
                                value={product.ingredients}
                                onChange={handleOnChange}/>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="form-group px-3 py-2">
                            <label>Allergles</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Allergles"
                                name="allergies"
                                value={product.allergies}
                                onChange={handleOnChange}/>
                        </div>
                        <div className="form-group px-3 py-2">
                            <label>Description</label>
                            <input className="block w-full border border-black rounded-sm" placeholder="Description"
                                name="description"
                                value={product.description} 
                                onChange={handleOnChange}/>
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
                            onClick={addProduct}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mx-12 mt-20 overflow-auto">
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
                        <tr>
                            <td>malaria, coach, headache</td>
                            <td>malaria</td>
                            <td>malaria</td>
                            <td></td>
                            <td>malaria2</td>
                            <td>malaria</td>
                            <td>250</td>
                            <td>Catellaon</td>
                            <td>Edit | Delete</td>
                        </tr>
                        <tr>
                            <td>malaria, coach, headache</td>
                            <td>malaria</td>
                            <td>malaria</td>
                            <td></td>
                            <td>malaria2</td>
                            <td>malaria</td>
                            <td>250</td>
                            <td>Catellaon</td>
                            <td>Edit | Delete</td>
                        </tr>
                        <tr>
                            <td>malaria, coach, headache</td>
                            <td>malaria</td>
                            <td>malaria</td>
                            <td></td>
                            <td>malaria2</td>
                            <td>malaria</td>
                            <td>250</td>
                            <td>Catellaon</td>
                            <td>Edit | Delete</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HomePage
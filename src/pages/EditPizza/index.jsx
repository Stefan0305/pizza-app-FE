import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Api from "../../Api";
import { CartContext } from "../../context/cartContext";
import { TagContext } from "../../context/tagContext";

const EditPizza = () => {
    const { id } = useParams();
    const [pizza, setPizza] = useState({tags: []});
    const [loading, setLoading] = useState(false);
    const tagContext = useContext(TagContext);
    const { pizzaProducts, setPizzaProducts } = useContext(CartContext);
    const tags = tagContext.tags.map(t => t.tag);
    // const tags = ['discount', 'vege', 'special-tag'];
    const [checkedState, setCheckedState] = useState(
        new Array(tags.length).fill(false),
    );
    const handleCheckedState = (position) => {
        const updatedCheckedState = checkedState.map((item, index) => 
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
        const newTags = updatedCheckedState.map((value, index) => {
            return value ? tags[index] : null;
        }).filter(tag => tag !== null);
        console.log('HANDLE FOR ' + position);
        console.log('checkedState', checkedState);
        console.log('updatedCheckedState', updatedCheckedState);
        console.log('tags', tags);
        console.log('newTags', newTags);
        setPizza({...pizza, tags: newTags});
    };
    useEffect(function () {
        Api().get(`/pizzas/${id}`).then(response => {
            setPizza(response.data);
            const tags = tagContext.tags.map(t => t.tag);
            setCheckedState(tags.map(_tag => response.data.tags.includes(_tag)));
        });
    }, [id]);
    useEffect(function () {
        const tags = tagContext.tags.map(t => t.tag);
        setCheckedState(tags.map(_tag => pizza.tags.includes(_tag)));
        console.log('useeff');
    }, [tagContext.tags]);
    const savePizza = async () => {
        console.log('SAVING PIZZA...');
        setLoading(true);
        const response = await Api().put(`/pizzas/${id}`, pizza);
        const { data } = response;
        if (data.ok === 1) {
            const newPizzas = pizzaProducts
            .map(_pizza => _pizza._id === id ? pizza : _pizza);
            setPizzaProducts(newPizzas);
            // alert('SUCCESSFULLY SAVED PIZZA!!');
        }
        setLoading(false);
    };
    const handleFormChange = (e, key) => {
        const newPizza = {...pizza};
        newPizza[key] = e.target.value;
        setPizza(newPizza);
    };
    const getCheckboxes = (value) => {
        return (
            <div>
                {
                    tags.map((tag, index) => {
                        return ( <label key={tag}> {tag}: 
                            <input type="checkbox" 
                                   checked={checkedState[index]}
                                   onChange={() => handleCheckedState(index)} />
                        </label> )
                    })
                }
            </div>
        );
    };
    const createInput = (key, value) => {
        let inputType;
        if (typeof value === 'string') {
            inputType = 'text';
        } else if (typeof value === 'number') {
            inputType = 'number';
        } else if (typeof value === 'object') {
            return getCheckboxes(value);
        }
        return <input type={inputType}
                      key={key}
                      value={value}
                      onChange={(e) => handleFormChange(e, key)}/>;
    };
    if (loading) {
        return ( <div id="editPizza">Loading...<img src="/loading.gif" alt="" /></div> )
    }
    return (
        <div id="editPizza">
            HI FROM EDIT {id}
            {JSON.stringify(pizza)}
            <div className="editForm">
                {
                    Object.keys(pizza).join(', ')
                }
                {
                    Object.keys(pizza)
                        .map(key => createInput(key, pizza[key]))
                }
                <button onClick={savePizza}>Save</button>
            </div>
        </div>
    );
};

export default EditPizza;
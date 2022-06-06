import { useEffect, useState } from "react";
import Api from "../../Api";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [hideConfirmed, setHideConfirmed] = useState(true);
    useEffect(() => {
        Api().get('/orders')
        .then((response) => setOrders(response.data))
        .catch(console.error);
    }, []);
    const deleteOrder = (orderId) => {
        // eslint-disable-next-line no-restricted-globals
        const confirmationAnswer = confirm('Are you sure you want to delete order? ' + orderId);
        if (!confirmationAnswer) return;
        Api().delete(`/orders/${orderId}`)
            .then((response) => {
                console.log('response', response);
                const {data} = response;
                if (data.deletedCount === 1) {
                    const newOrders = orders.filter(order => order._id !== orderId);
                    setOrders(newOrders);
                } else {
                    alert('Something went wrong!')
                }
            })
            .catch(console.error);
    };
    const confirmOrder = (orderId) => {
        Api().put(`/orders/${orderId}`, {
            confirmed: true,
        }).then(response => {
            console.log('response', response);
            const { data } = response;
            if (data && data.ok === 1) {
                const newOrders = orders.map(order => {
                    if (order._id === orderId) {
                        return {...order, confirmed: true};
                    }
                    return order;
                });
                setOrders(newOrders);
            }
        }).catch(console.error);
    };
    const handleHideConfirmedCheckbox = (e) => setHideConfirmed(e.target.checked);
    return (
        <div id="orders">
            <label>
                Hide confimed:
                <input type="checkbox" checked={hideConfirmed} onChange={handleHideConfirmedCheckbox} />
            </label>
            {
                orders
                    .filter(order => hideConfirmed ? !order.confirmed : true)
                    .map((order) => (
                        <div className={'order' + (order.confirmed ? ' order-confirmed' : '')} key={order._id}>
                            {order.confirmed ? 'CONFIRMED' : ''}
                            <button className="delete-btn" onClick={() => deleteOrder(order._id)}>❌</button>
                            <h5>Order ID: {order._id}</h5>
                            <h4>Email: {order.email}</h4>
                            <h4>Address: {order.address}</h4>
                            <ol>
                                {
                                    order.cartItems.map(item => (
                                        <li>{item.name}, {item.selectedPizzaSize}, X{item.quantity} </li>
                                    ))
                                }
                            </ol>
                            <button onClick={() => confirmOrder(order._id)}>Confirm order</button>
                        </div>
                    ))
            }
        </div>
    );
};

export default OrdersPage;
import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap';


function App() {
  return <h1>Hello, React!</h1>;
}

ReactDOM.render(<App />, document.getElementById('app'));

new Vue({
    el: '#app',
    data: {
        users: []
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        fetchUsers() {
            fetch('/users')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.users = data.users;
                    } else {
                        console.error('Error al obtener los usuarios:', data);
                    }
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                });
        }
    }
});


import React, { useEffect, useState } from 'react'
import { getTodos } from '../../../api/ComApi'
import { AxiosResponse } from 'axios';
import { Table } from 'react-bootstrap';

export default function Home() {

  const [todos, setTodos]: any = useState([]);

  useEffect(() => {
    async function getTodosLoad() {
      const resulttodos = await getTodos();
      setTodos(resulttodos);
    }

    getTodosLoad();

  }, []);

  return (
    <div>
      <h1>Last activities : </h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Device name</th>
            <th>IP</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {todos !== undefined ? (
            <>
              {todos.map((todo: any) => (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.name}</td>
                  <td>{todo.ip}</td>
                  <td>{todo.reachable === true ? "connected" : "disconnected"}</td>
                </tr>
              ))}
            </>
          ) : ( <></> )
          }
        </tbody>
      </Table>
    </div>
  )
}

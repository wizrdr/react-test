import React, { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import faker from 'faker'
import { nanoid } from 'nanoid'

import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST } from 'Router/routes'

import { Column, Container, Post, PostAuthor, PostBody } from './styles'

import ExpensiveTree from '../ExpensiveTree'

function Root() {
  const countRef = useRef(0)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [fields, setFields] = useState([
    {
      name: faker.name.findName(),
      id: nanoid(),
    },
  ])

  const [value, setValue] = useState('')
  const { data, loading } = useQuery(postsQuery, { variables: { page, limit } })

  function handlePush() {
    setFields([{ name: faker.name.findName(), id: nanoid() }, ...fields])
  }

  function handleAlertClick() {
    setTimeout(() => {
      alert(`You clicked ${countRef.current} times`)
    }, 2500)
  }

  function handleSelectedPage(seletedPage) {
    setPage(+seletedPage.target.value)
  }

  const totalPosts = data?.posts?.meta?.totalCount
  const totalPages = totalPosts / limit
  const pages = Array.from({ length: totalPages }, (v, i) => i + 1)
  const posts = data?.posts.data || []

  return (
    <Container>
      <Column>
        <h4>Need to add pagination</h4>
        {loading
          ? 'Loading...'
          : posts.map(post => (
              <Post key={post.id} mx={4}>
                <NavLink href={POST(post.id)} to={POST(post.id)}>
                  {post.title}
                </NavLink>
                <PostAuthor>by {post.user.name}</PostAuthor>
                <PostBody>{post.body}</PostBody>
              </Post>
            ))}
        <div>
          {!isNaN(totalPosts) && (
            <div>
              <label>Page:</label>
              <div>
                {pages.map(pageNo => (
                  <button
                    key={pageNo}
                    type="button"
                    value={pageNo}
                    onClick={handleSelectedPage}
                  >
                    {pageNo}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Column>
      <Column>
        <h4>Slow rendering</h4>
        <label>
          Enter something here:
          <br />
          <input
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
        </label>
        <p>So slow...</p>
        <ExpensiveTree />

        <h4>Closures</h4>
        <p>You clicked {count} times</p>
        <button
          type="button"
          onClick={() => {
            countRef.current = count + 1
            setCount(count + 1)
          }}
        >
          Click me
        </button>
        <button type="button" onClick={handleAlertClick}>
          Show alert
        </button>
      </Column>

      <Column>
        <h4>Incorrect form field behavior</h4>
        <button type="button" onClick={handlePush}>
          Add more
        </button>
        <ol>
          {fields.map(field => (
            <li key={field.id}>
              {field.name}:<br />
              <input type="text" />
            </li>
          ))}
        </ol>
      </Column>
    </Container>
  )
}

export default Root

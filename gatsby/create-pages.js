'use strict'

const path = require('path')
const _ = require('lodash')
const createCategoriesPages = require('./pagination/create-categories-pages.js')
const createTagsPages = require('./pagination/create-tags-pages.js')
const createPostsPages = require('./pagination/create-posts-pages.js')

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // 404
  createPage({
    path: '/404',
    component: path.resolve('./src/templates/not-found-template.js'),
  })

  // Tags list
  createPage({
    path: '/tags',
    component: path.resolve('./src/templates/tags-list-template.js'),
  })

  // Categories list
  createPage({
    path: '/categories',
    component: path.resolve('./src/templates/categories-list-template.js'),
  })

  // Posts and pages from markdown

  // drafe가 false인 상태의 글들을 조회해온다.
  const result = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
        edges {
          node {
            frontmatter {
              template
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  const { edges } = result.data.allMarkdownRemark

  // foreach
  _.each(edges, edge => {
    // template이 page인 경우 page-template을 사용하여 페이지를 생성한다.
    if (_.get(edge, 'node.frontmatter.template') === 'page') {
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve('./src/templates/page-template.js'),
        context: { slug: edge.node.fields.slug },
      })
    }
    // template이 post인 경우 post-template을 사용하여 페이지를 생성한다.
    else if (_.get(edge, 'node.frontmatter.template') === 'post') {
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve('./src/templates/post-template.js'),
        context: { slug: edge.node.fields.slug },
      })
    }
  })

  // Feeds
  await createTagsPages(graphql, actions)
  await createCategoriesPages(graphql, actions)
  await createPostsPages(graphql, actions)
}

module.exports = createPages

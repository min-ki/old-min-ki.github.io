'use strict';

const _ = require('lodash');
const { createFilePath } = require('gatsby-source-filesystem');

const onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // 노드의 타입이 마크다운인경우에
  if (node.internal.type === 'MarkdownRemark') {
    // slug 필드가 undefined가 아닐때에
    if (typeof node.frontmatter.slug !== 'undefined') {
      // 이 노드가 속한 폴더이름을가져와서
      const dirname = getNode(node.parent).relativeDirectory;
      // 노드를 확장시켜 slug라는 필드를 만들고 value로 값을 설정한다.
      createNodeField({
        node,
        name: 'slug',
        value: `/${dirname}/${node.frontmatter.slug}`
      });
    } else {
      // 파일로부터 URL을 위한 경로를 생성해준다.
      const value = createFilePath({ node, getNode });
      // 파일의 경로를 가져와서 바로 slug로 만들어준다.
      createNodeField({
        node,
        name: 'slug',
        value
      });
    }

    // tags가 있다면
    if (node.frontmatter.tags) {
      // tag를 kebabCase로 변경
      // a-b-c 와 같이 공백을 -(dash) 로 변경
      // fields 하위에 tagSlugs 필드를 추가
      const tagSlugs = node.frontmatter.tags.map(
        tag => `/tag/${_.kebabCase(tag)}/`
      );
      createNodeField({ node, name: 'tagSlugs', value: tagSlugs });
    }

    // 카테고리 노드를 생성해준다.
    if (node.frontmatter.category) {
      const categorySlug = `/category/${_.kebabCase(
        node.frontmatter.category
      )}/`;
      createNodeField({ node, name: 'categorySlug', value: categorySlug });
    }
  }
};

module.exports = onCreateNode;

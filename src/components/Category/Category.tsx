// @flow strict
import { Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import useCategoriesList from '../../hooks/use-categories-list'

const Category = () => {
  const categories = useCategoriesList()

  return (
    <Block>
      <h3 style={{ marginTop: '10px' }}>Category</h3>
      {categories.map(
        (category: { fieldValue: string; totalCount: number }) => (
          <CategoryBlock to={`/category/${category.fieldValue.toLowerCase()}`}>
            <CategoryName>{category.fieldValue}</CategoryName>
            <CategoryCount>({category.totalCount})</CategoryCount>
          </CategoryBlock>
        )
      )}
    </Block>
  )
}

export default Category

const Block = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.4rem;
`

const CategoryBlock = styled(Link)`
  color: black;
  font-weight: 500;
`

const CategoryName = styled.span`
  cursor: pointer;
`

const CategoryCount = styled.span`
  position: relative;
`

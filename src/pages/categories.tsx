import React, { useRef, useEffect } from 'react'
import useCategoriesList from '../hooks/use-categories-list'
import { Link } from 'gatsby'

type Props = {
  title?: string
  children: React.ReactNode
}

const Page = ({ title, children }: Props) => {
  const categories = useCategoriesList()

  return (
    <div>
      <ul>
        {categories.map(
          (category: { fieldValue: string; totalCount: number }) => (
            <Link to={`/category/${category.fieldValue.toLowerCase()}`}>
              <div>
                {category.fieldValue} ({category.totalCount})
              </div>
            </Link>
          )
        )}
      </ul>
    </div>
  )
}

export default Page

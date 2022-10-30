import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ActiveLink = ({ as, href, children }) => {
  const router = useRouter()

  let className = children.props.className || ''
  if (router.asPath === as) {
    className = `${className} active`;
  }

  return <Link href={href} as={as} legacyBehavior>{React.cloneElement(children, { className })}</Link>;
}

export default ActiveLink;

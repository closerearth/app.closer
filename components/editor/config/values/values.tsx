/** @jsxRuntime classic */
/** @jsx jsx */
import { ELEMENT_HR, TDescendant } from '@udecode/plate'
import { jsx } from '@udecode/plate-test-utils'
import { initialDataExcalidraw } from './initialDataExcalidraw'
import { createList, getNodesWithRandomId } from './utils'

jsx

const align: any = (
  <fragment>
    <hp align="left">
      This block text is aligned to the left.
    </hp>
  </fragment>
)

export const VALUES: Record<string, any> = {
  align,
}
  
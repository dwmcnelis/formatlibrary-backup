
import React from 'react'
import {camelize, urlize} from '../../functions/utility'

const PrintRow = (props) => {
  const { index, print } = props
  const evenOrOdd = index % 2 ? 'even' : 'odd'
  const tcgPlayerUrl = print.tcgPlayerUrl + '?utm_campaign=affiliate&utm_medium=FormatLibrary&utm_source=FormatLibrary' || 
    `https://store.tcgplayer.com/yugioh/${urlize(print.setName)}/${urlize(print.cardName)}?utm_campaign=affiliate&utm_medium=FormatLibrary&utm_source=FormatLibrary`
  const openNewTab = () => window.open(tcgPlayerUrl, "_blank")
  const id = print.rarity === '10000 Secret Rare' ? 'tenThousandSecretRare' : camelize(print.rarity)
  

  return (
    <tr onClick={() => openNewTab()} className={`${evenOrOdd}-print-row`}>
        <td className="rarity-cell" id={id}/>
        <td className="print-cell-2">
            {print.rarity}
        </td>
        <td className="print-cell-3">
            {print.cardCode}
        </td>
        <td className="print-cell-4">
            {print.setName}
        </td>
        <td className="print-cell-5">
            {print.set.tcgDate}
        </td>
    </tr>
  )
}

export default PrintRow

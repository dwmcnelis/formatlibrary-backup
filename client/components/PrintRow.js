
import React from 'react'
import {camelize, urlize} from '../../functions/utility'

const PrintRow = (props) => {
  const { index, print } = props
  const evenOrOdd = index % 2 ? 'even' : 'odd'
  const tcgPlayerUrl = print.tcgPlayerUrl || `https://store.tcgplayer.com/yugioh/${urlize(print.setName)}/${urlize(print.cardName)}`
  const openNewTab = () => window.open(tcgPlayerUrl, "_blank")
  const id = print.rarity === '10000 Secret Rare' ? 'tenThousandSecretRare' : camelize(print.rarity)

  return (
    <tr onClick={() => openNewTab()} className={`${evenOrOdd}-print-row`}>
        <td className="rarity-cell" id={id}/>
        <td className="print-cell" style={{width:"180px"}}>
            {print.rarity}
        </td>
        <td className="print-cell" style={{width:"100px"}}>
            {print.cardCode}
        </td>
        <td className="print-cell" style={{width:"500px"}}>
            {print.setName}
        </td>
        <td className="print-cell" style={{width:"100px"}}>
            {print.set.tcgDate}
        </td>
    </tr>
  )
}

export default PrintRow

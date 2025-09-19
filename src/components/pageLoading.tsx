import React, { useEffect, useState } from 'react'


type Props = {
   label?: string
}

export default function PageLoading({ label }: Props) {
   return (
      <div>
         <div className='fixed inset-0 flex flex-col gap-6 items-center justify-center z-[99] w-full h-full bg-white/80 text-primary'>
            {/* <Typography variant='h6'>{label}</Typography> */}
            {/* <CircularProgress /> */}
         </div>
      </div>
   )
}

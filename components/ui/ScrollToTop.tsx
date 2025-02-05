'use client'
import { useState, useEffect } from "react"
import { IoIosArrowUp } from "react-icons/io";

const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);
	
	const toggleVisibility = () => {
		if(window.pageYOffset > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);			
		}
	}

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility);
		// return () => {
		// 	window.removeEventListener
		// }
	}, []);

	return (
    <div className="fixed bottom-4 right-4 z-50 ">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-1 text-white rounded-full shadow-lg bg-black-100 border-4"
        >
					<IoIosArrowUp size={50} className='text-white'/>
        </button>
      )}
    </div>
	)
}

export default ScrollToTop

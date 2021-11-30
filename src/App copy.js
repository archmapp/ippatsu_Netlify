import React, { useState, useEffect, useRef } from 'react'
import FlashcardList from './FlashcardList'
import './App.css'
import { cats, imgs } from './imgs'

const MAX_IMGS = 8

// .log(imgs)

function App() {
	const [flashcards, setFlashcards] = useState(imgs)
	const [flashcardNO, setFlashcardNO] = useState(0)
	const [kiokuJikanID, setKiokuJikanID] = useState(10)
	const [seikai, setSeikai] = useState(0)
	// console.log('🚀 ~ file: App.js:45 ~ flashcardNO', flashcardNO)
	const [flipALL, setFlipALL] = useState(false)
	const [running, setRunning] = useState(false)
	const [conf, setConf] = useState(false)

	const categoryEl = useRef()
	let timeoutID = useRef()
	let startID = useRef(null)

	useEffect(() => {
		handleSelect()
	}, [])

	function handleJikan(e) {
		setKiokuJikanID((curr) => (curr === 10 ? 5 : 10))

		e.target.blur()
	}

	function handleSelect() {
		clearTimeout(timeoutID.current)
		timeoutID.current = null

		let imgSel = [...imgs]
		const cat = categoryEl.current.value

		if (cat === 'パレットのみ') {
			imgSel = imgs.filter((questionItem) => {
				return /^\.\/img\/Palette/.test(questionItem)
			})
		}
		// console.log('🚀 ~ file: App.js ~ line 45 ~ imgSel ~ imgSel', imgSel)
		imgSel.sort(() => Math.random() - 0.5) // シャッフル
		// console.log('🚀 ~ file: App.js ~ line 45 ~ imgSel ~ imgSel', imgSel)
		setFlashcards(imgSel.splice(0, MAX_IMGS)) // splice(0,8): 切り取った先頭8枚を返す
		setFlashcardNO(Math.floor(Math.random() * MAX_IMGS))

		reset_0()
	}

	function reset_0() {
		setSeikai(0)
		setFlipALL(false)
		setRunning(false)
		setConf(false)
	}

	function handleStart() {
		handleSelect()
		reset_0()
		setSeikai(11)
		timeoutID.current = setTimeout(() => start(), kiokuJikanID * 1000)
	}

	function start() {
		startID.current = setTimeout(() => {
			startID.current = null
		}, 3000)
		setSeikai(0)
		setFlipALL(true)
		setRunning(true)
		setConf(false)
	}

	return (
		<>
			<form className="header is-size-7-mobile px-2 mb-0">
				{seikai === 1 && <h2 style={{ color: 'red' }}>'最高！'</h2>}
				{seikai === 2 && <h2 style={{ color: 'red' }}>'正解'</h2>}
				{seikai === -1 && <h2 style={{ color: '#777' }}>残念</h2>}
				{seikai === 0 && <h2> </h2>}
				{seikai === 11 && (
					<h2>
						<progress
							className="progress is-danger"
							style={{ width: '3rem' }}
							// value="100"
							max="100"
						>
							100%
						</progress>
					</h2>
				)}
				<div className="form-group">
					<label htmlFor="category" className="">
						画像選択
					</label>
					<select id="category" ref={categoryEl} onChange={handleSelect}>
						{cats.map((category) => {
							return (
								<option value={category.id} key={category.id}>
									{category.name}
								</option>
							)
						})}
					</select>
				</div>

				<div className="form-group">
					<button
						className="btn is-size-7-mobile"
						type="button"
						onClick={() => handleStart()}
					>
						スタート
					</button>
				</div>
				{/* button 要素の type 属性の初期値は submit なので、フォーム内で送信ボタンとする場合は type 属性を省略できます。

				※ 但し、逆に言うとフォーム内で type 属性を指定していない場合や type 属性が空であったり不正な値であったりした場合は送信ボタンとなります。 
				*/}
			</form>

			{/* <div className="containerOut"> */}
			<div
				className="container"
				style={{ display: 'flex', flexDirection: 'column' }}
			>
				{/* <div className="title"> */}
				<div className="title px-4 py-2 my-0" id="order">
					<h3 className="is-size-4">一発勝負❣</h3>
					<h4
						className="is-size-7-mobile is-size-6-tablet has-tooltip-bottom"
						data-tooltip="記憶力強化"
					>
						トランプゲーム
					</h4>
					<ul>
						<li>
							<span>
								[<span>スタート</span>]
							</span>
							ボタンを押して、
							<button
								className={`button is-small is-danger has-tooltip-bottom has-tooltip-danger ${
									kiokuJikanID === 5 ? 'px-2' : 'px-1'
								}`}
								data-tooltip="記憶時間: 10・5秒"
								style={{ height: '1.2rem' }}
								onClick={(e) => handleJikan(e)}
							>
								{kiokuJikanID}秒間
							</button>
							で記憶し
						</li>
						<li className="mt-1">その後、表示された図柄を見つけてください</li>
					</ul>
				</div>
				<div>
					<FlashcardList
						flashcards={flashcards}
						flashcardNO={flashcardNO}
						flipALL={flipALL}
						setFlipALL={setFlipALL}
						running={running}
						startID={startID}
						setRunning={setRunning}
						setSeikai={setSeikai}
						seikai={seikai}
						conf={conf}
						setConf={setConf}
					/>
				</div>
				{/* </div> */}
			</div>
		</>
	)
}

export default App

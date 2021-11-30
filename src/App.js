import React, { useState, useEffect, useRef } from 'react'
import FlashcardList from './FlashcardList'
import './App.css'

import $$ from './shortJS'
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
	let startedID = useRef(null)

	useEffect(() => {
		$$.oe(
			document,
			(e) => {
				if (e.key === 'Escape') {
					// console.log(e.key)
					$$.qcL('.quickT')
				}
			},
			'keyup'
		)
		$$.qcLm('#quick', { selT: '.quickT' })
		// bulmaQuickview.attach()

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
		startedID.current = setTimeout(() => {
			startedID.current = null
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
								data-tooltip="記憶時間: 10秒／5秒"
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
						startedID={startedID}
						setRunning={setRunning}
						setSeikai={setSeikai}
						seikai={seikai}
						conf={conf}
						setConf={setConf}
					/>
				</div>
			</div>

			<nav id="orderB">
				<div className="is-flex is-justify-content-center is-align-items-center py-2 ">
				{/* <div className="is-flex is-justify-content-center is-align-items-center has-background-grey py-2 "> */}
					<button
						className="button is-primary has-tooltip-top has-tooltip-warning"
						data-tooltip="トグル: [Escape]キーも可"
						id="quick"
					>
						ゲーム一覧
					</button>
					<span className="has-text-white ml-5">そのほかの ゲームアプリ</span>
				</div>
			</nav>

			<article>
				<div className="quickview quickT">
					{/* <div id="quickviewDefault" className="quickview quickT my-1"> */}
					{/* <div className="box has-background-primary p-2"> */}
					<div className="box p-2" style={{ backgroundColor: '#375A7F' }}>
						<header className="quickview-header">
							<p className="is-size-4 has-text-white">ゲーム一覧</p>
							<span
								className="delete deleteQV"
								onClick={() => {
									$$.qcL('.quickT')
								}}
								// data-dismiss="quickview"
							></span>
						</header>

						<div className="quickview-body">
							<article className="message is-primary mb-0">
								<div className="message-header pb-1">
									<p>リンク先</p>
								</div>
								<div className="message-body is-size-6 py-2 px-0">
									<table className="table is-hoverable">
										<tbody>
											<tr>
												<th className="has-text-right">
													<a href="https://affectionate-wozniak-de01a2.netlify.app/">
														初めての【 けいさん 】
													</a>
												</th>
												<td className="td_flex-direction">だれでもできる</td>
											</tr>
											<tr>
												<th className="is-size-7 has-text-right">
													しんけいすいじゃく・作成中
												</th>
												<td className="td_width">忍者トランプ</td>
											</tr>
											<tr>
												<th className="has-text-right">
													一発勝負 <span style={{ color: 'red' }}>❣</span>
												</th>
												<td className="td_boxes">記憶ゲーム</td>
											</tr>
										</tbody>
									</table>
								</div>
							</article>
							<article className="message is-primary mt-3">
								<div className="message-header py-2 is-justify-content-center">
									<p className="is-size-7">
										<span>このビューの開閉について (トグル操作)</span>
									</p>
								</div>
								<div className="message-body py-1 ml-5 is-size-7">
									<ul>
										<li>
											画面下の［
											<span className="has-background-primary has-text-white">
												ゲーム一覧
											</span>
											］ボタンをクリックして開く
										</li>
										<li>
											[
											<span className="has-background-primary has-text-white">
												ESC
											</span>
											］キーを押して開閉することも出来ます
										</li>
									</ul>
								</div>
							</article>
						</div>
						<footer className="quickview-footer has-background-primary mt-4 mt-2 pb-3">
							<div
								className="mt-3"
								style={{ textAlign: 'center', width: '500px' }}
							>
								<div className="is-half-mobile is-one-quarter-desktop">
									<h6 className="title is-5 pb-1 mb-4">
										提供: <span className="is-size-5">アーキエムアップ</span>
									</h6>
									<p>
										<a href="http://www.archmapp.tech/">
											<strong className="is-success">
												第二版・Bulmaと共に！
											</strong>
										</a>
									</p>
									<address>
										<strong
											className="is-size-5 px-2 mb-3"
											style={{ background: '#e3c800' }}
										>
											Bulma Project
										</strong>
										<p className="mt-3">北九州</p>

										<i className="fas fa-fw fa-envelope lightcoral"></i>
										<span className="mb-5">
											<a href="mailto:archmapp@i.softbank.jp">
												archmapp@i.softbank.jp
											</a>
										</span>
									</address>
								</div>
							</div>
						</footer>
					</div>
				</div>
			</article>
		</>
	)
}

export default App

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TrashIcon } from '@heroicons/react/24/outline';
import { useLiveQuery } from 'dexie-react-hooks';

import Dropzone from './Dropzone';
import { db } from '../../backgroundTasks/dexieDb/db';
import { conditionalClassNames } from '../../utils/classNames';

const tabs = [
	{ name: 'All', href: '#', current: true },
	{ name: 'Collections', href: '#', current: false },
];

export default function Files() {
	const documents = useLiveQuery(() => db.DocumentMetadata.toArray());
	return (
		<>
			<div className="flex h-full">
				{/* Content area */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* Main content */}
					<div className="flex flex-1 items-stretch overflow-hidden">
						<main className="flex-1 overflow-y-auto">
							<div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
								<div className="flex w-full">
									<div className="flex flex-col gap-2 flex-1">
										<h1 className="text-2xl font-bold text-gray-900">Files</h1>
										<p className="max-w-md">
											Upload files to enable semantic search and ideation
											using OpenAI APIs, allowing you to efficiently generate
											and discover ideas within small to medium-sized
											documents.
										</p>
										<p className="text-sm">Supported file types: txt</p>
									</div>
									<div className="flex-1">
										<Dropzone />
									</div>
								</div>

								{/* Tabs */}
								<div className="mt-3 sm:mt-2">
									<div className="sm:hidden">
										<label htmlFor="tabs" className="sr-only">
											Select a tab
										</label>
										{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
										<select
											id="tabs"
											name="tabs"
											className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-inset focus:ring-slate-600"
											defaultValue="Recently Viewed"
										>
											<option>All</option>
											<option>Collections</option>
										</select>
									</div>
									<div className="hidden sm:block">
										<div className="flex items-center border-b border-gray-200">
											<nav
												className="-mb-px flex flex-1 space-x-6 xl:space-x-8"
												aria-label="Tabs"
											>
												{tabs.map((tab) => (
													<a
														key={tab.name}
														href={tab.href}
														aria-current={
															tab.current ? 'page' : undefined
														}
														className={conditionalClassNames(
															tab.current
																? 'border-slate-500 text-slate-600'
																: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
															'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
														)}
													>
														{tab.name}
													</a>
												))}
											</nav>
										</div>
									</div>
								</div>

								{/* Gallery */}
								<section className="mt-8 pb-16" aria-labelledby="gallery-heading">
									<h2 id="gallery-heading" className="sr-only">
										All
									</h2>
									<ul
										role="list"
										className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
									>
										{documents?.map((file) => (
											<li key={file.name} className="relative">
												<div
													className={conditionalClassNames(
														'focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100',
														'aspect-w-10 aspect-h-7 group block w-full overflow-hidden rounded-lg bg-gray-100',
													)}
												>
													<img
														alt=""
														className={conditionalClassNames(
															'group-hover:opacity-75',
															'pointer-events-none object-cover',
														)}
													/>
													<button
														type="button"
														className="absolute inset-0 focus:outline-none"
													>
														<span className="sr-only">
															View details for {file.name}
														</span>
													</button>
												</div>
												<div className="flex items-center justify-between gap-2">
													<div>
														<p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
															{file.name}
														</p>
														<p className="pointer-events-none block text-sm font-medium text-gray-500">
															{file.file_format}
														</p>
													</div>
													<button
														className="bg-slate-50 p-1 rounded-md"
														onClick={async () => {
															await db.DocumentMetadata.delete(
																file.id!,
															);
															await db.DocumentCollections.filter(
																(collection) => {
																	return collection.documents.has(
																		file.id!,
																	);
																},
															).delete();
															await db.DocumentEmbeddings.where({
																document_id: file.id!,
															}).delete();
														}}
													>
														<TrashIcon
															className={
																'text-red-700 mx-0 h-6 w-6 flex-shrink-0'
															}
															aria-hidden="true"
														/>
													</button>
												</div>
											</li>
										))}
									</ul>
								</section>
							</div>
						</main>
					</div>
				</div>
			</div>
		</>
	);
}

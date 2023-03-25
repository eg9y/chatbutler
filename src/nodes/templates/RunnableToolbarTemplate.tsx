import { PauseIcon } from '@heroicons/react/20/solid';
import { NodeToolbar } from 'reactflow';

import RunButton from '../../components/RunButton';
import { conditionalClassNames } from '../../utils/classNames';

export default function RunnableToolbarTemplate(
	data: any,
	selected: boolean,
	updateNode: any,
	id: string,
) {
	return (
		<NodeToolbar offset={0} isVisible={data.isBreakpoint || selected}>
			{/* TODO: Breakpoints */}
			<div className="flex gap-2 justify-end items-center text-md">
				<button
					className={conditionalClassNames(
						data.isBreakpoint
							? 'bg-red-900 text-red-500'
							: 'bg-yellow-20/50 text-yellow-500 font-semibold border-1 border-yellow-500',
						'  text-md py-1 px-2 rounded flex items-center',
					)}
					onClick={() => {
						data.isBreakpoint = !data.isBreakpoint;
						updateNode(id, data);
					}}
				>
					<PauseIcon
						className={conditionalClassNames(
							data.isBreakpoint ? 'text-red-500' : 'text-yellow-500',
							' -ml-1 mr-1 h-5 w-5 flex-shrink-0 text-red-100',
						)}
						aria-hidden="true"
					/>
					<span>{!data.isBreakpoint && 'Set'} Breakpoint</span>
				</button>
				<RunButton text="Run Node" id={id} />
			</div>
		</NodeToolbar>
	);
}

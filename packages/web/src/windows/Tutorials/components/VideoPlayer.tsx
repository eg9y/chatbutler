const VideoPlayer = ({ videoSource }: { videoSource: string }) => {
	return (
		<div className="w-max">
			<video
				width="900"
				height="900"
				controls
				style={{
					border: '1px solid slategray',
					borderRadius: '4px',
				}}
				className="ml-10"
			>
				<source src={videoSource} type="video/webm" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
};

export default VideoPlayer;

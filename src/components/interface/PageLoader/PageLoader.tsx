import React, { FC, HTMLAttributes, JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { Watch } from 'react-loader-spinner';

const PageLoader: FC = () => {

    return (
        <div className='LoaderScreen'>
            <Watch ariaLabel='Loading...'
                color="#fff"
                height={300}
                width={300} />;
            <h1 style={{ "color": "#fff" }}>Loading...</h1>
        </div>
    );
}

export default PageLoader;
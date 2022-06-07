import React, { FC, HTMLAttributes, JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OverlayTriggerRenderProps } from 'react-bootstrap/esm/OverlayTrigger';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: ReactElement<any, string | JSXElementConstructor<any>> | ((props: OverlayTriggerRenderProps) => ReactNode)
    clickHandler?: (e: any) => void;
    tooltip?: string;
    position: 'top' | 'right' | 'bottom' | 'left';
}

const IconWithTooltip: FC<Props> = (props) => {

    return (
        <div>
            {[props.position].map((placement) => {
                return (
                    <OverlayTrigger
                        key={placement}
                        placement={props.position}
                        overlay={<Tooltip id={`tooltip-${placement}`}>
                            <strong>{props.tooltip}</strong>
                        </Tooltip>}
                    >
                        {props.children}
                    </OverlayTrigger>
                );
            })}
        </div>
    );
}

export default IconWithTooltip;
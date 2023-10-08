import React from 'react';
import Icon from "../Icon/Icon";
import { useTheme } from '../../context/ThemeContext/ThemeContext';

type ExpertiseProps = {
  content: {
    icon: string,
    title: string,
    dim: string,
    body: string
    color: string
  }
}

export default function Expertise({content}: ExpertiseProps) {
    const { theme } = useTheme();

    const size = {
        height: content.dim,
        width: content.dim,
    }

  return (
    <div className="flex gap-6">
        <Icon name={content.icon} color={theme === "light" ? content.color : "#ffffff"} classes="shrink-0" style={size} />

        <div className="flex flex-col gap-2">
            <h4 className="text-base uppercase text-gray-700 dark:text-zinc-100 font-bold">{content.title}</h4>
            <p className="text-base leading-loose text-gray-600 dark:text-zinc-100">
                {content.body}
            </p>
        </div>
    </div>
  )
}

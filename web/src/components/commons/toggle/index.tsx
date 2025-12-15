import style from './styles.module.css';
export const Toggle = ({ title, onClick, permissions, id }) => {
    return (
        <div className={style.toggle_wrapper}>
            <div className={style.toggle_title}>{title}</div>
            <label htmlFor={id} className={style.toggle_btn} onClick={onClick}>
                <input
                    type="checkbox"
                    id={id}
                    className={style.check_box}
                    checked={permissions}
                    readOnly // permissions의 상태값에 따라 제어되기 때문에 읽기전용으로 처리
                />
            </label>
        </div>
    );
};

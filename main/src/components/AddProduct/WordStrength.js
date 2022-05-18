import { Typography } from "@mui/material";

const getProductNameStrength = (name) => {
    if (name === '')
        return 0;
    let size = name.trim().split(' ').length;
    return size;
}

const getStrengthLabel = (value) => {

    switch (value) {
        case 1:
            return 'Weak';
        case 2:
            return 'Fair';
        case 3:
            return 'Good';
        case 4:
            return 'Strong';
        default:
            return 'Weak';
    }

}

const WordStrength = (props) => {

    const strength = getProductNameStrength(props.productName);
    const strengthLabel = getStrengthLabel(strength);

    return (
        <>
            <progress
                value={strength}
                max="4"
                className={`productName-strength-meter-progress strength-${strengthLabel}`}
                style={{ width: "100%" }}
            />
            <Typography
                variant="body1"
            >
                <b>Product Name Strength: </b> {strengthLabel}
            </Typography>
        </>
    )

}

export default WordStrength;
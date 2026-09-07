import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class CityWeaponMapper
extends Mapper<LongWritable, Text, Text, IntWritable> {

    private final static IntWritable one =
            new IntWritable(1);

    private Text outputKey =
            new Text();

    public void map(LongWritable key,
                    Text value,
                    Context context)
            throws IOException, InterruptedException {

        String line = value.toString();

        if(line.startsWith("Report Number"))
            return;

        String[] fields = line.split(",");

        try {

            String city =
                    fields[4].trim();

            String weapon =
                    fields[9].trim();

            outputKey.set(
                    city + "\t" + weapon
            );

            context.write(
                    outputKey,
                    one
            );

        }
        catch(Exception e) {

        }
    }
}